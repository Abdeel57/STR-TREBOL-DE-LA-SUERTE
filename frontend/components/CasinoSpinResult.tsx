import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, ShoppingCart, RefreshCw, X, Ticket } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import confetti from 'canvas-confetti';

interface CasinoSpinResultProps {
    selectedTickets: number[];
    totalPrice: number;
    onBuy: () => void;
    onSpinAgain: () => void;
    onClose: () => void;
}

const CasinoSpinResult: React.FC<CasinoSpinResultProps> = ({ selectedTickets, totalPrice, onBuy, onSpinAgain, onClose }) => {
    const { appearance, preCalculatedTextColors } = useTheme();
    const accentColor = appearance?.colors?.accent || '#00ff00';
    const [isSpinning, setIsSpinning] = useState(true);
    const [displayNumber, setDisplayNumber] = useState(0);

    useEffect(() => {
        // Start spinning effect
        setIsSpinning(true);

        // Rapidly change numbers
        const interval = setInterval(() => {
            setDisplayNumber(Math.floor(Math.random() * 9999));
        }, 50);

        // Stop after 1.5s
        const timer = setTimeout(() => {
            clearInterval(interval);
            setIsSpinning(false);
            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: [accentColor, '#ffffff', '#ffd700']
            });
        }, 1500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [selectedTickets, accentColor]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-background-secondary border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-6 text-center flex-1 flex flex-col overflow-hidden">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center relative shrink-0">
                        <motion.div
                            animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
                            transition={isSpinning ? { duration: 0.5, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                        >
                            <Dices size={40} style={{ color: accentColor }} />
                        </motion.div>
                        {isSpinning && (
                            <div
                                className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                                style={{ background: accentColor }}
                            />
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {isSpinning ? (
                            <motion.div
                                key="spinning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center min-h-[200px]"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">Buscando tu suerte...</h2>
                                <div className="text-5xl font-mono font-bold text-slate-500 opacity-50">
                                    {displayNumber.toString().padStart(4, '0')}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col overflow-hidden"
                            >
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    ¡{selectedTickets.length} Boletos!
                                </h2>
                                <p className="text-slate-300 text-sm mb-4">
                                    Seleccionados especialmente para ti
                                </p>

                                {/* Ticket List */}
                                <div className="bg-slate-900/50 rounded-xl p-3 mb-4 overflow-y-auto custom-scrollbar flex-1 border border-slate-700/30">
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {selectedTickets.map(ticket => (
                                            <span
                                                key={ticket}
                                                className="px-2 py-1 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700"
                                            >
                                                {ticket.toString().padStart(3, '0')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Total Price */}
                                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 mb-6 border border-slate-700 shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Total a pagar:</span>
                                        <span className="text-2xl font-bold" style={{ color: accentColor }}>
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 shrink-0">
                                    <button
                                        onClick={onBuy}
                                        className="w-full py-3 px-6 rounded-xl font-bold text-lg text-background-primary flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                                        style={{ background: accentColor }}
                                    >
                                        <ShoppingCart size={20} />
                                        Comprar Ahora
                                    </button>

                                    <button
                                        onClick={onSpinAgain}
                                        className="w-full py-3 px-6 rounded-xl font-bold text-white bg-slate-700 hover:bg-slate-600 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <RefreshCw size={20} />
                                        Volver a Tirar
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default CasinoSpinResult;
