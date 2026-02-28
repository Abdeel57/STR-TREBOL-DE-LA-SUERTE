import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Header = () => {
    const { appearance } = useTheme();

    // Obtener colores del tema o usar valores por defecto
    const primaryColor = appearance?.colors?.action || '#0ea5e9';
    const accentColor = appearance?.colors?.accent || '#ec4899';
    const headerColor = primaryColor; // Usar el color action como color principal del header
    const verificationBlue = '#3b82f6'; // Azul de verificación

    return (
        <header className="relative w-full sticky top-0 z-50 overflow-hidden">
            {/* Línea de color superior */}
            <div
                className="w-full h-1"
                style={{
                    background: `linear-gradient(90deg, ${headerColor} 0%, ${accentColor} 50%, ${headerColor} 100%)`
                }}
            />

            {/* Barra principal del header */}
            <div
                className="w-full py-2 md:py-2.5 px-4 md:px-6 flex justify-center items-center"
                style={{
                    backgroundColor: appearance?.colors?.backgroundSecondary || '#1f2937'
                }}
            >
                <div className="w-full max-w-[85%] sm:max-w-[70%] md:max-w-[55%] lg:max-w-[45%] relative flex justify-center mx-auto">
                    <div className="flex items-center justify-between relative w-full gap-2 md:gap-4">
                        {/* Botón Izquierdo - Métodos de Pago */}
                        <Link
                            to="/cuentas-de-pago"
                            className="flex-1 flex items-center justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full max-w-[180px] md:max-w-[220px] px-4 py-3 md:py-3.5 rounded-lg font-bold text-white text-xs md:text-sm transition-all duration-300"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#ffffff'
                                }}
                            >
                                <div className="flex flex-col items-center leading-tight">
                                    <span
                                        style={{
                                            textShadow: `0 0 10px ${headerColor}80, 0 0 20px ${headerColor}60, 0 0 30px ${headerColor}40`
                                        }}
                                    >
                                        MÉTODOS
                                    </span>
                                    <span
                                        style={{
                                            textShadow: `0 0 10px ${headerColor}80, 0 0 20px ${headerColor}60, 0 0 30px ${headerColor}40`
                                        }}
                                    >
                                        DE PAGO
                                    </span>
                                </div>
                            </motion.button>
                        </Link>

                        {/* Logo en el centro */}
                        <Link
                            to="/"
                            className="flex-shrink-0 mx-4 md:mx-8 relative"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                {(appearance?.logoUrl || (appearance as any)?.logo) ? (
                                    <div className="relative">
                                        {/* Efecto de resplandor sutil siempre visible */}
                                        <div
                                            className="absolute inset-0 opacity-60 blur-2xl"
                                            style={{
                                                background: `radial-gradient(circle, ${headerColor}40 0%, transparent 70%)`,
                                                transform: 'scale(1.2)'
                                            }}
                                        />
                                        {/* Contenedor del logo - 92px sin bordes (tamaño ajustado) */}
                                        <div className="relative w-[92px] h-[92px] flex items-center justify-center bg-transparent">
                                            <img
                                                src={appearance.logoUrl || (appearance as any)?.logo}
                                                alt={appearance?.siteName || 'Logo'}
                                                className="w-full h-full object-contain bg-transparent"
                                                style={{
                                                    mixBlendMode: 'normal',
                                                    filter: `drop-shadow(0 0 5px ${headerColor}80) drop-shadow(0 0 10px ${headerColor}60) drop-shadow(0 0 15px ${headerColor}40) drop-shadow(0 0 20px ${headerColor}30) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))`
                                                }}
                                                onError={(e) => {
                                                    console.error('Error loading logo:', e);
                                                }}
                                            />
                                        </div>
                                        {/* Badge de verificación - siempre visible, esquina superior derecha, azul */}
                                        <div
                                            className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10"
                                            style={{ backgroundColor: verificationBlue }}
                                        >
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Efecto de resplandor sutil siempre visible */}
                                        <div
                                            className="absolute inset-0 opacity-60 blur-2xl"
                                            style={{
                                                background: `radial-gradient(circle, ${headerColor}40 0%, transparent 70%)`,
                                                transform: 'scale(1.2)'
                                            }}
                                        />
                                        {/* Contenedor cuadrado con nombre - 92px sin bordes (tamaño ajustado) */}
                                        <div
                                            className="relative w-[92px] h-[92px] flex items-center justify-center rounded-lg"
                                            style={{
                                                backgroundColor: appearance?.colors?.backgroundPrimary || '#111827'
                                            }}
                                        >
                                            <span
                                                className="text-3xl md:text-4xl font-black"
                                                style={{ color: headerColor }}
                                            >
                                                {appearance?.siteName?.charAt(0) || 'L'}
                                            </span>
                                        </div>
                                        {/* Badge de verificación - siempre visible, esquina superior derecha, azul */}
                                        <div
                                            className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10"
                                            style={{ backgroundColor: verificationBlue }}
                                        >
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </Link>

                        {/* Botón Derecho - Verificar Boletos */}
                        <Link
                            to="/verificador"
                            className="flex-1 flex items-center justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full max-w-[180px] md:max-w-[220px] px-4 py-3 md:py-3.5 rounded-lg font-bold text-white text-xs md:text-sm transition-all duration-300"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#ffffff'
                                }}
                            >
                                <div className="flex flex-col items-center leading-tight">
                                    <span
                                        style={{
                                            textShadow: `0 0 10px ${headerColor}80, 0 0 20px ${headerColor}60, 0 0 30px ${headerColor}40`
                                        }}
                                    >
                                        VERIFICAR
                                    </span>
                                    <span
                                        style={{
                                            textShadow: `0 0 10px ${headerColor}80, 0 0 20px ${headerColor}60, 0 0 30px ${headerColor}40`
                                        }}
                                    >
                                        BOLETOS
                                    </span>
                                </div>
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Línea de color inferior */}
            <div
                className="w-full h-1"
                style={{
                    background: `linear-gradient(90deg, ${headerColor} 0%, ${accentColor} 50%, ${headerColor} 100%)`
                }}
            />
        </header>
    );
};

export default Header;
