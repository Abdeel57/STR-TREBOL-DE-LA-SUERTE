import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeGrid as Grid } from 'react-window';
import type { GridChildComponentProps } from 'react-window';
import { Check, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { isMobile } from '../utils/deviceDetection';
import { useTheme } from '../contexts/ThemeContext';
import { DesignSystemUtils } from '../utils/design-system-utils';

interface TicketSelectorProps {
    totalTickets: number;
    occupiedTickets: number[];
    selectedTickets: number[];
    listingMode?: 'paginado' | 'scroll';
    hideOccupied?: boolean;
    onTicketClick: (ticket: number) => void;
}

type ScrollGridData = {
    tickets: number[];
    columns: number;
    cellWidth: number;
    cellGap: number;
    hideOccupied: boolean;
    occupiedSet: Set<number>;
    selectedSet: Set<number>;
    createTicketNode: (ticket: number, isOccupied: boolean, isSelected: boolean) => React.ReactNode;
};

// Increased gap for better touch targets
const CELL_GAP = 12;
const MIN_SCROLL_HEIGHT = 320;

const VirtualTicketCell: React.FC<GridChildComponentProps<ScrollGridData>> = ({ columnIndex, rowIndex, style, data }) => {
    const index = rowIndex * data.columns + columnIndex;
    if (index >= data.tickets.length) {
        return <div style={style} />;
    }

    const ticket = data.tickets[index];
    if (data.hideOccupied && data.occupiedSet.has(ticket)) {
        return <div style={style} />;
    }

    const isOccupied = data.occupiedSet.has(ticket);
    const isSelected = data.selectedSet.has(ticket);
    const content = data.createTicketNode(ticket, isOccupied, isSelected);

    if (!content) {
        return <div style={style} />;
    }

    const marginRight = columnIndex === data.columns - 1 ? 0 : data.cellGap;
    const marginBottom = data.cellGap;

    return (
        <div
            style={{
                ...style,
                width: data.cellWidth + marginRight,
                height: data.cellWidth + marginBottom,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    width: data.cellWidth,
                    height: data.cellWidth,
                    marginRight,
                    marginBottom,
                }}
            >
                {content}
            </div>
        </div>
    );
};

const TicketSelector = ({ totalTickets, occupiedTickets, selectedTickets, onTicketClick, listingMode = 'paginado', hideOccupied = false }: TicketSelectorProps) => {
    const { appearance, preCalculatedTextColors } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 50;
    const occupiedSet = useMemo(() => new Set(occupiedTickets), [occupiedTickets]);

    // Usar colores pre-calculados (optimización de rendimiento)
    const backgroundColor = appearance?.colors?.backgroundPrimary || '#1a1a1a';
    const accentColor = appearance?.colors?.accent || '#00ff00';
    const textColor = preCalculatedTextColors.description;

    const orderedTickets = useMemo(() => {
        if (!totalTickets || totalTickets <= 0) return [];
        const allTickets = Array.from({ length: totalTickets }, (_, i) => i + 1);
        const available = allTickets.filter(ticket => !occupiedSet.has(ticket));
        if (hideOccupied) {
            return available;
        }
        const occupiedOnly = allTickets.filter(ticket => occupiedSet.has(ticket));
        return [...available, ...occupiedOnly];
    }, [totalTickets, occupiedSet, hideOccupied]);

    const totalDisplayTickets = orderedTickets.length;
    const totalPages = Math.max(1, Math.ceil((totalDisplayTickets || 0) / ticketsPerPage));

    useEffect(() => {
        setCurrentPage(prev => Math.min(prev, totalPages));
    }, [totalPages]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800));

    useEffect(() => {
        const updateDimensions = () => {
            if (typeof window !== 'undefined') {
                setViewportHeight(window.innerHeight);
            }
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        updateDimensions();

        const handleResize = () => updateDimensions();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        const observer = typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(updateDimensions)
            : null;

        if (observer && containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
            if (observer && containerRef.current) {
                observer.unobserve(containerRef.current);
            }
            observer?.disconnect();
        };
    }, []);

    const ticketPadding = useMemo(() => {
        if (!totalTickets || totalTickets <= 0) return 1;
        return String(totalTickets).length;
    }, [totalTickets]);

    const mobile = useMemo(() => {
        try {
            return isMobile();
        } catch {
            return false;
        }
    }, []);

    const selectedSet = useMemo(() => new Set(selectedTickets), [selectedTickets]);

    const createTicketNode = useCallback((ticket: number, isOccupied: boolean, isSelected: boolean) => {
        // Increased font size and weight for better readability
        const baseClasses = 'relative p-1 text-center rounded-xl text-base font-bold cursor-pointer transition-all duration-200 flex items-center justify-center aspect-square shadow-sm';

        // Estilos dinámicos basados en el estado
        let bgStyle: React.CSSProperties = {};
        let textStyle: React.CSSProperties = {};

        if (isOccupied) {
            bgStyle = { background: 'rgba(50, 50, 50, 0.3)', border: '1px solid rgba(100, 100, 100, 0.2)' };
            textStyle = { color: 'rgba(150, 150, 150, 0.3)' };
        } else if (isSelected) {
            bgStyle = {
                background: accentColor,
                boxShadow: `0 0 15px ${accentColor}60`,
                transform: 'scale(1.05)',
                zIndex: 10
            };
            // Usar color pre-calculado para boletos seleccionados
            textStyle = { color: preCalculatedTextColors.title };
        } else {
            bgStyle = {
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative' as const,
                overflow: 'hidden' as const
            };
            textStyle = { color: textColor };
        }

        const stateClasses = isOccupied
            ? 'cursor-not-allowed'
            : isSelected
                ? 'font-extrabold'
                : 'hover:bg-white/10 hover:border-white/20';

        const ticketContent = (
            <>
                {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-white text-black rounded-full p-0.5 shadow-sm z-20">
                        <Check size={12} strokeWidth={4} />
                    </div>
                )}
                <span
                    className="relative z-10"
                    style={textStyle}
                >
                    {String(ticket).padStart(ticketPadding, '0')}
                </span>
            </>
        );

        if (mobile) {
            return (
                <div
                    className={`${baseClasses} ${stateClasses}`}
                    style={bgStyle}
                    onClick={() => !isOccupied && onTicketClick(ticket)}
                >
                    {ticketContent}
                </div>
            );
        }

        return (
            <motion.div
                className={`${baseClasses} ${stateClasses}`}
                style={bgStyle}
                onClick={() => !isOccupied && onTicketClick(ticket)}
                whileHover={!isOccupied ? { scale: 1.1, zIndex: 20 } : {}}
                whileTap={{ scale: isOccupied ? 1 : 0.9 }}
            >
                <AnimatePresence>
                    {ticketContent}
                </AnimatePresence>
            </motion.div>
        );
    }, [mobile, onTicketClick, ticketPadding, backgroundColor, accentColor, textColor]);

    const paginatedTickets = useMemo(() => {
        if (listingMode !== 'paginado' || totalDisplayTickets <= 0) {
            return [];
        }

        const start = (currentPage - 1) * ticketsPerPage;
        const end = start + ticketsPerPage;

        return orderedTickets
            .slice(start, end)
            .map(ticket => {
                const isOccupied = occupiedSet.has(ticket);
                const isSelected = selectedSet.has(ticket);
                const content = createTicketNode(ticket, isOccupied, isSelected);

                if (!content) return null;

                return (
                    <div key={ticket} className="flex items-center justify-center">
                        {content}
                    </div>
                );
            })
            .filter(Boolean) as React.ReactNode[];
    }, [listingMode, orderedTickets, totalDisplayTickets, currentPage, ticketsPerPage, occupiedSet, selectedSet, createTicketNode]);

    const columns = useMemo(() => {
        // Optimized for mobile: fewer columns = bigger buttons
        if (containerWidth >= 1024) return 10;
        if (containerWidth >= 768) return 8;
        if (containerWidth >= 640) return 7;
        if (containerWidth >= 480) return 6;
        if (containerWidth >= 350) return 5; // Standard mobile
        return 4; // Very small screens
    }, [containerWidth]);

    const cellWidth = useMemo(() => {
        if (columns <= 0 || containerWidth <= 0) return 64;
        const totalGap = CELL_GAP * (columns - 1);
        const availableWidth = Math.max(containerWidth - totalGap, 0);
        return Math.max(Math.floor(availableWidth / columns), 48); // Ensure minimum touch target size
    }, [columns, containerWidth]);

    const gridWidth = useMemo(() => {
        if (columns <= 0) return containerWidth;
        return Math.min(containerWidth, columns * (cellWidth + CELL_GAP) - CELL_GAP);
    }, [columns, containerWidth, cellWidth]);

    const gridHeight = useMemo(() => {
        if (listingMode !== 'scroll') return 0;
        const desired = cellWidth * 6;
        const basedOnViewport = Math.floor(viewportHeight * 0.6);
        return Math.max(MIN_SCROLL_HEIGHT, Math.min(desired, basedOnViewport || desired));
    }, [cellWidth, listingMode, viewportHeight]);

    const rowCount = useMemo(() => {
        if (columns <= 0 || totalDisplayTickets <= 0) return 0;
        return Math.ceil(totalDisplayTickets / columns);
    }, [columns, totalDisplayTickets]);

    const itemData = useMemo<ScrollGridData>(() => ({
        tickets: orderedTickets,
        columns,
        cellWidth,
        cellGap: CELL_GAP,
        hideOccupied,
        occupiedSet,
        selectedSet,
        createTicketNode,
    }), [orderedTickets, columns, cellWidth, hideOccupied, occupiedSet, selectedSet, createTicketNode]);

    const Legend = () => {
        const legendTextColor = preCalculatedTextColors.description;
        return (
            <div
                className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-sm"
                style={{ color: legendTextColor }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                        }}
                    />
                    <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ background: accentColor }}
                    />
                    <span>Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: 'rgba(50, 50, 50, 0.5)' }}
                    />
                    <span className="opacity-50">Vendido</span>
                </div>
            </div>
        );
    };

    const showScrollGrid = listingMode === 'scroll' && totalDisplayTickets > 0 && columns > 0 && rowCount > 0;

    const containerBgColor = appearance?.colors?.backgroundPrimary || '#1a1a1a';
    const containerTextColor = preCalculatedTextColors.description;

    return (
        <div
            className="p-2 rounded-xl shadow-lg relative overflow-hidden"
            style={{
                background: containerBgColor,
                border: `1px solid ${appearance?.colors?.accent || '#00ff00'}20`,
                boxShadow: `0 0 40px -10px ${appearance?.colors?.accent || '#00ff00'}10`
            }}
        >
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at top, ${appearance?.colors?.accent || '#00ff00'}40 0%, transparent 60%)`
                }}
            />
            <div className="relative z-10">
                <Legend />
                <div ref={containerRef}>
                    {listingMode === 'scroll' ? (
                        showScrollGrid ? (
                            <Grid
                                columnCount={columns}
                                columnWidth={cellWidth + CELL_GAP}
                                height={gridHeight}
                                rowCount={rowCount}
                                rowHeight={cellWidth + CELL_GAP}
                                width={gridWidth}
                                itemData={itemData}
                                className="mx-auto custom-scrollbar"
                            >
                                {VirtualTicketCell}
                            </Grid>
                        ) : (
                            <div className="text-center text-sm text-slate-400 py-6">
                                {totalDisplayTickets > 0
                                    ? 'Cargando boletos...'
                                    : 'No hay boletos disponibles en este momento.'}
                            </div>
                        )
                    ) : (
                        <div
                            className="grid gap-3"
                            style={{
                                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
                            }}
                        >
                            {paginatedTickets}
                        </div>
                    )}
                </div>
                {listingMode === 'paginado' && (
                    <div
                        className="flex justify-center items-center gap-2 mt-3"
                        style={{ color: containerTextColor }}
                    >
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 10))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg disabled:opacity-50 transition-transform active:scale-95"
                            style={{
                                background: appearance?.colors?.action || '#0066ff',
                                color: preCalculatedTextColors.title
                            }}
                            title="-10 páginas"
                        >
                            <ChevronsLeft size={18} />
                        </button>

                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg disabled:opacity-50 font-semibold transition-transform active:scale-95 text-sm"
                            style={{
                                background: appearance?.colors?.action || '#0066ff',
                                color: preCalculatedTextColors.title
                            }}
                        >
                            Anterior
                        </button>
                        <span className="font-mono font-bold text-sm min-w-[80px] text-center">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg disabled:opacity-50 font-semibold transition-transform active:scale-95 text-sm"
                            style={{
                                background: appearance?.colors?.action || '#0066ff',
                                color: preCalculatedTextColors.title
                            }}
                        >
                            Siguiente
                        </button>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 10))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg disabled:opacity-50 transition-transform active:scale-95"
                            style={{
                                background: appearance?.colors?.action || '#0066ff',
                                color: preCalculatedTextColors.title
                            }}
                            title="+10 páginas"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketSelector;