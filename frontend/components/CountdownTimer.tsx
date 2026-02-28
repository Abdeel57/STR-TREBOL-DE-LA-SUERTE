import React, { useState, useEffect } from 'react';
import { intervalToDuration, isAfter } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CountdownTimer = ({ targetDate }: { targetDate: Date | string }) => {
    // Normalizar targetDate a objeto Date para comparaciones consistentes
    const target = React.useMemo(() => {
        const date = new Date(targetDate);
        if (isNaN(date.getTime())) {
            console.error('Invalid target date:', targetDate);
            return null;
        }
        return date;
    }, [targetDate]);

    const calculateTimeLeft = React.useCallback(() => {
        if (!target) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const now = new Date();

        if (isAfter(now, target)) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        // Calcular diferencia total en milisegundos
        const diffMs = target.getTime() - now.getTime();

        // Convertir a diferentes unidades de tiempo
        const totalSeconds = Math.floor(diffMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        // Calcular los valores restantes después de extraer las unidades mayores
        const days = totalDays;
        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        return {
            days,
            hours,
            minutes,
            seconds,
        };
    }, [target]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    // Actualizar cuando cambia targetDate
    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
    }, [calculateTimeLeft]);

    useEffect(() => {
        // Actualizar el contador cada segundo
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]); // Recrear el timer cuando cambia la fecha objetivo

    // Calcular cuántos dígitos necesita cada unidad (mínimo 2, máximo lo necesario)
    const getDigitCount = (value: number): number => {
        if (value >= 1000) return 4; // Para valores muy grandes (aunque es raro)
        if (value >= 100) return 3;  // Para valores >= 100
        if (value >= 10) return 2;  // Para valores >= 10
        return 2;                    // Mínimo 2 dígitos (incluye 0-9)
    };

    const timeUnits = [
        { label: 'Día', value: timeLeft.days, digitCount: getDigitCount(timeLeft.days) },
        { label: 'Hora', value: timeLeft.hours, digitCount: getDigitCount(timeLeft.hours) },
        { label: 'Minuto', value: timeLeft.minutes, digitCount: getDigitCount(timeLeft.minutes) },
        { label: 'Segundo', value: timeLeft.seconds, digitCount: getDigitCount(timeLeft.seconds) },
    ];

    // Verificar si la fecha es válida
    if (!target) {
        return (
            <div className="text-center">
                <div className="text-red-400 text-lg mb-2">⚠️</div>
                <div className="text-red-400 text-sm">Fecha de sorteo inválida</div>
            </div>
        );
    }

    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        return <div className="text-center font-bold text-accent text-2xl">¡EL SORTEO HA FINALIZADO!</div>
    }

    return (
        <div className="flex justify-center items-start gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {timeUnits.map((unit, index) => {
                // Determinar el tamaño de los dígitos basado en el número de dígitos
                const isThreeOrMoreDigits = unit.digitCount >= 3;
                const isFourDigits = unit.digitCount >= 4;

                // Tamaños de contenedor ajustados según número de dígitos - Más grandes y relucientes
                const digitSizeClasses = isFourDigits
                    ? "w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-18 lg:w-14 lg:h-20" // Más grande para 4 dígitos
                    : isThreeOrMoreDigits
                        ? "w-10 h-14 sm:w-12 sm:h-18 md:w-14 md:h-20 lg:w-16 lg:h-24" // Más grande cuando hay 3 dígitos
                        : "w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 lg:w-18 lg:h-28"; // Tamaño grande para 2 dígitos

                // Tamaños de texto ajustados - Más grandes y relucientes
                const textSizeClasses = isFourDigits
                    ? "text-lg sm:text-xl md:text-2xl lg:text-3xl" // Más grande para 4 dígitos
                    : isThreeOrMoreDigits
                        ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl" // Texto más grande para 3 dígitos
                        : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"; // Tamaño grande para 2 dígitos

                // Espacios entre dígitos ajustados
                const gapClasses = isThreeOrMoreDigits
                    ? "gap-0.5 sm:gap-1 md:gap-1" // Gaps más pequeños para 3+ dígitos
                    : "gap-1 sm:gap-1.5 md:gap-2"; // Gaps normales para 2 dígitos

                // Determinar el ancho del contenedor basado en el número de dígitos
                const containerWidthClasses = isFourDigits
                    ? "min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[90px]"
                    : isThreeOrMoreDigits
                        ? "min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px]"
                        : "min-w-[45px] sm:min-w-[55px] md:min-w-[65px] lg:min-w-[75px]";

                const containerHeightClasses = isFourDigits
                    ? "h-12 sm:h-14 md:h-16 lg:h-18"
                    : isThreeOrMoreDigits
                        ? "h-14 sm:h-16 md:h-18 lg:h-20"
                        : "h-16 sm:h-18 md:h-20 lg:h-24";

                return (
                    <React.Fragment key={unit.label}>
                        {/* Unidad de tiempo (días, horas, minutos, segundos) */}
                        <div className="flex flex-col items-center min-w-0">
                            {/* Contenedor único con el número completo */}
                            <motion.div
                                key={`${unit.label}-${unit.value}`}
                                className="relative flex-shrink-0"
                            >
                                <div className={`${containerWidthClasses} ${containerHeightClasses} bg-background-secondary/80 backdrop-blur-md rounded-xl overflow-hidden border border-accent/30 shadow-lg shadow-accent/10 flex items-center justify-center px-2 sm:px-3`}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={String(unit.value).padStart(unit.digitCount, '0')}
                                            initial={{ y: '-100%', opacity: 0 }}
                                            animate={{ y: '0%', opacity: 1 }}
                                            exit={{ y: '100%', opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className={`flex items-center justify-center ${textSizeClasses} font-black text-accent`}
                                            style={{
                                                textShadow: '0 0 20px rgba(var(--color-accent), 0.5)'
                                            }}
                                        >
                                            {String(unit.value).padStart(unit.digitCount, '0')}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                            {/* Etiqueta debajo del número */}
                            <div className="mt-1 sm:mt-1.5 text-center w-full">
                                <span className="text-[10px] sm:text-xs text-white/70 font-medium uppercase tracking-wide">
                                    {unit.label}
                                </span>
                            </div>
                        </div>
                        {/* Separador (dos puntos) - solo entre unidades, no después de la última */}
                        {index < timeUnits.length - 1 && (
                            <div className="flex items-center self-center pt-8 sm:pt-10 md:pt-12 lg:pt-14 px-1 sm:px-2">
                                <span className="text-accent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-none"
                                    style={{
                                        textShadow: '0 0 10px rgba(var(--color-accent), 0.5)'
                                    }}
                                >
                                    :
                                </span>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default CountdownTimer;