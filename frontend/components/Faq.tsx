import React, { useState, useEffect, memo, useMemo } from 'react';
import { getSettings } from '../services/api';
import { FaqItemData } from '../types';
import FaqItem from './FaqItem';
import { useTheme } from '../contexts/ThemeContext';
import DesignSystemUtils from '../utils/design-system-utils';
import { isMobile } from '../utils/deviceDetection';

const Faq = () => {
    const [faqs, setFaqs] = useState<FaqItemData[]>([]);
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);
    const { appearance, preCalculatedTextColors } = useTheme();
    const mobile = isMobile();
    
    // Obtener colores del tema
    const accentColor = appearance?.colors?.accent || '#ec4899';
    
    // Usar colores pre-calculados (optimización de rendimiento)
    const titleColor = preCalculatedTextColors.title;

    useEffect(() => {
        getSettings().then(settings => setFaqs(settings.faqs));
    }, []);

    const toggleFaq = (id: string) => {
        setOpenFaqId(prevId => {
            // Si la pregunta actual está abierta, cerrarla; si no, abrir esta y cerrar cualquier otra
            if (prevId === id) {
                return null;
            }
            return id;
        });
    };

    if (faqs.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            {/* Header - Sin animaciones para mejor rendimiento */}
            <div className="text-center mb-8 md:mb-10">
                <h2 
                    className="text-4xl md:text-5xl lg:text-6xl font-black mb-4"
                    style={{ color: titleColor }}
                >
                    Preguntas Frecuentes
                </h2>
            </div>

            {/* Grid - Sin animaciones de entrada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {faqs.map((faq, index) => {
                    // Asegurar que cada FAQ tenga un ID único
                    const faqId = faq.id || `faq-${index}`;
                    const isCurrentlyOpen = openFaqId === faqId;
                    
                    return (
                        <div key={faqId}>
                            <FaqItem 
                                question={faq.question} 
                                answer={faq.answer} 
                                isOpen={isCurrentlyOpen}
                                onClick={() => toggleFaq(faqId)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Footer informativo - Simplificado en móviles */}
            {faqs.length > 0 && (
                <div className="mt-8 md:mt-10 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl border border-action/20 ${mobile ? 'bg-background-secondary' : 'bg-gradient-to-r from-action/15 to-accent/15'}`}>
                        {/* Icono de interrogación pequeño - Sin filtros en móviles */}
                        <svg 
                            className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" 
                                fill={accentColor}
                            />
                        </svg>
                        <p className="text-xs md:text-sm text-slate-300">
                            ¿No encuentras lo que buscas? <span className="text-accent font-semibold">Contáctanos</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Faq);
