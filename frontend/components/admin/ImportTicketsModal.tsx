import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertTriangle, Check, ArrowRight, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { adminValidateTickets, adminImportTickets } from '../../services/api';
import { useToast } from '../../hooks/useToast';

interface ImportTicketsModalProps {
    isOpen: boolean;
    onClose: () => void;
    raffleId: string;
    onSuccess: () => void;
}

interface TicketData {
    nombre: string;
    telefono: string;
    estado: string;
    boleto: number;
    originalRow: any;
}

const ImportTicketsModal: React.FC<ImportTicketsModalProps> = ({ isOpen, onClose, raffleId, onSuccess }) => {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<'upload' | 'mapping' | 'validation' | 'conflicts' | 'importing' | 'success'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [mapping, setMapping] = useState({
        nombre: '',
        telefono: '',
        estado: '',
        boleto: ''
    });

    const [parsedTickets, setParsedTickets] = useState<TicketData[]>([]);
    const [conflicts, setConflicts] = useState<TicketData[]>([]);
    const [validTickets, setValidTickets] = useState<TicketData[]>([]);
    const [importStats, setImportStats] = useState({ success: 0, failed: 0 });

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseExcel(selectedFile);
        }
    };

    const parseExcel = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (jsonData.length > 0) {
                    const cols = jsonData[0] as string[];
                    setColumns(cols);
                    setPreviewData(jsonData.slice(1, 6)); // Preview first 5 rows

                    // Auto-map columns if names match
                    const newMapping = { ...mapping };
                    cols.forEach(col => {
                        const lower = col.toLowerCase();
                        if (lower.includes('nombre')) newMapping.nombre = col;
                        if (lower.includes('telefono') || lower.includes('celular')) newMapping.telefono = col;
                        if (lower.includes('estado')) newMapping.estado = col;
                        if (lower.includes('boleto') || lower.includes('ticket')) newMapping.boleto = col;
                    });
                    setMapping(newMapping);
                    setStep('mapping');
                }
            } catch (error) {
                console.error('Error parsing Excel:', error);
                toast.error('Error', 'No se pudo leer el archivo Excel');
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleMappingSubmit = async () => {
        if (!mapping.nombre || !mapping.telefono || !mapping.boleto) {
            toast.error('Error', 'Debes mapear al menos Nombre, Teléfono y Boleto');
            return;
        }

        // Process all rows
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const processed: TicketData[] = jsonData.map((row: any) => ({
                nombre: row[mapping.nombre] || '',
                telefono: String(row[mapping.telefono] || ''),
                estado: mapping.estado ? (row[mapping.estado] || '') : '',
                boleto: Number(row[mapping.boleto]),
                originalRow: row
            })).filter(t => t.boleto && !isNaN(t.boleto));

            setParsedTickets(processed);
            await validateTickets(processed);
        };
        if (file) reader.readAsBinaryString(file);
    };

    const validateTickets = async (tickets: TicketData[]) => {
        setStep('validation');
        try {
            const ticketNumbers = tickets.map(t => t.boleto);
            const takenNumbers = await adminValidateTickets(raffleId, ticketNumbers);

            const conflictList: TicketData[] = [];
            const validList: TicketData[] = [];

            tickets.forEach(t => {
                if (takenNumbers.includes(t.boleto)) {
                    conflictList.push(t);
                } else {
                    validList.push(t);
                }
            });

            setConflicts(conflictList);
            setValidTickets(validList);

            if (conflictList.length > 0) {
                setStep('conflicts');
            } else {
                // No conflicts, go straight to import confirmation or auto-import?
                // Let's show a summary before importing
                setStep('conflicts'); // Re-use conflicts view to show summary even if 0 conflicts
            }
        } catch (error) {
            console.error('Error validating tickets:', error);
            toast.error('Error', 'Falló la validación de boletos');
            setStep('mapping');
        }
    };

    const handleResolveConflict = (index: number, action: 'skip' | 'update', newTicket?: number) => {
        const newConflicts = [...conflicts];
        const ticket = newConflicts[index];

        if (action === 'skip') {
            newConflicts.splice(index, 1);
        } else if (action === 'update' && newTicket) {
            // Move to valid list with new number
            const updatedTicket = { ...ticket, boleto: newTicket };
            setValidTickets([...validTickets, updatedTicket]);
            newConflicts.splice(index, 1);
        }
        setConflicts(newConflicts);
    };

    const handleImport = async () => {
        setStep('importing');
        try {
            const result = await adminImportTickets(raffleId, validTickets);
            setImportStats({
                success: result.data.success,
                failed: result.data.failed
            });
            setStep('success');
            onSuccess();
        } catch (error) {
            console.error('Error importing tickets:', error);
            toast.error('Error', 'Falló la importación de boletos');
            setStep('conflicts');
        }
    };

    const reset = () => {
        setFile(null);
        setStep('upload');
        setPreviewData([]);
        setParsedTickets([]);
        setConflicts([]);
        setValidTickets([]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileSpreadsheet className="text-green-500" />
                        Importar Boletos
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'upload' && (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                            />
                            <Upload size={48} className="text-slate-400 mb-4" />
                            <p className="text-lg text-slate-300 font-medium">Haz clic para subir tu Excel</p>
                            <p className="text-sm text-slate-500 mt-2">Soporta .xlsx, .xls, .csv</p>
                        </div>
                    )}

                    {step === 'mapping' && (
                        <div className="space-y-6">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <p className="text-blue-200 text-sm">
                                    Confirma qué columna de tu Excel corresponde a cada dato del sistema.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-300">Columna Nombre *</label>
                                    <select
                                        value={mapping.nombre}
                                        onChange={(e) => setMapping({ ...mapping, nombre: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                    >
                                        <option value="">Seleccionar columna...</option>
                                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-300">Columna Teléfono *</label>
                                    <select
                                        value={mapping.telefono}
                                        onChange={(e) => setMapping({ ...mapping, telefono: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                    >
                                        <option value="">Seleccionar columna...</option>
                                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-300">Columna Estado (Opcional)</label>
                                    <select
                                        value={mapping.estado}
                                        onChange={(e) => setMapping({ ...mapping, estado: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                    >
                                        <option value="">Seleccionar columna...</option>
                                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-300">Columna Boleto *</label>
                                    <select
                                        value={mapping.boleto}
                                        onChange={(e) => setMapping({ ...mapping, boleto: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                                    >
                                        <option value="">Seleccionar columna...</option>
                                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-slate-400 mb-3">Vista Previa (Primeras 5 filas)</h4>
                                <div className="overflow-x-auto rounded-lg border border-slate-700">
                                    <table className="w-full text-sm text-left text-slate-300">
                                        <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                            <tr>
                                                {columns.map(col => (
                                                    <th key={col} className="px-4 py-3 whitespace-nowrap">{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, i) => (
                                                <tr key={i} className="border-b border-slate-700 hover:bg-slate-800/50">
                                                    {columns.map(col => (
                                                        <td key={col} className="px-4 py-2 whitespace-nowrap">{row[col]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'validation' && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <RefreshCw className="animate-spin text-accent mb-4" size={48} />
                            <p className="text-xl text-white font-medium">Validando boletos...</p>
                        </div>
                    )}

                    {step === 'conflicts' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold text-green-400">{validTickets.length}</p>
                                    <p className="text-sm text-green-200">Boletos Válidos</p>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold text-red-400">{conflicts.length}</p>
                                    <p className="text-sm text-red-200">Conflictos (Ocupados)</p>
                                </div>
                            </div>

                            {conflicts.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <AlertTriangle className="text-yellow-500" />
                                        Resolver Conflictos
                                    </h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                        {conflicts.map((conflict, idx) => (
                                            <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">Boleto #{conflict.boleto}</p>
                                                    <p className="text-sm text-slate-400">{conflict.nombre} - {conflict.telefono}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleResolveConflict(idx, 'skip')}
                                                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition-colors"
                                                    >
                                                        Saltar
                                                    </button>
                                                    {/* Future: Add Modify Logic here if needed, for now simple skip is safer */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'importing' && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <RefreshCw className="animate-spin text-accent mb-4" size={48} />
                            <p className="text-xl text-white font-medium">Importando boletos...</p>
                            <p className="text-slate-400 mt-2">Esto puede tomar unos momentos</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <Check size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">¡Importación Completada!</h3>
                            <p className="text-slate-300 mb-6">
                                Se importaron {importStats.success} boletos exitosamente.<br />
                                {importStats.failed > 0 && <span className="text-red-400">Hubo {importStats.failed} errores.</span>}
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-between">
                    {step === 'mapping' && (
                        <>
                            <button onClick={reset} className="text-slate-400 hover:text-white">Cancelar</button>
                            <button
                                onClick={handleMappingSubmit}
                                className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                Continuar <ArrowRight size={18} />
                            </button>
                        </>
                    )}
                    {step === 'conflicts' && (
                        <>
                            <button onClick={() => setStep('mapping')} className="text-slate-400 hover:text-white">Atrás</button>
                            <button
                                onClick={handleImport}
                                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                Importar {validTickets.length} Boletos
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportTicketsModal;
