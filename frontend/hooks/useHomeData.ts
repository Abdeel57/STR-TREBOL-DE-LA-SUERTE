import { useState, useEffect } from 'react';
import { getActiveRaffles, getPastWinners } from '../services/api';
import { Raffle, Winner } from '../types';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface UseHomeDataResult {
    raffles: Raffle[];
    winners: Winner[];
    loading: boolean;
    mainRaffle: Raffle | null;
    otherRaffles: Raffle[];
}

export const useHomeData = (): UseHomeDataResult => {
    const [raffles, setRaffles] = useState<Raffle[]>([]);
    const [winners, setWinners] = useState<Winner[]>([]);
    const [loading, setLoading] = useState(true);
    const { trackPageView } = useAnalytics();

    useEffect(() => {
        setLoading(true);
        trackPageView('/');
        
        // CRÍTICO: Cargar datos de forma secuencial en móviles (no paralelo)
        // Promise.all puede sobrecargar móviles de gama baja
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        
        if (isMobile) {
            // Móviles: Cargar secuencialmente (más lento pero más estable)
            getActiveRaffles()
                .then(raffleData => {
                    setRaffles(raffleData);
                    return getPastWinners();
                })
                .then(winnerData => {
                    setWinners(winnerData);
                })
                .catch(err => {
                    console.error('Error fetching home data (mobile sequence):', err);
                    setRaffles([]);
                    setWinners([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Desktop: Cargar en paralelo (más rápido)
            Promise.all([
                getActiveRaffles(),
                getPastWinners()
            ]).then(([raffleData, winnerData]) => {
                setRaffles(raffleData);
                setWinners(winnerData);
            }).catch(err => {
                console.error('Error fetching home data (parallel):', err);
                setRaffles([]);
                setWinners([]);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [trackPageView]);

    const mainRaffle = raffles.length > 0 ? raffles[0] : null;
    const otherRaffles = raffles.length > 1 ? raffles.slice(1) : [];

    return {
        raffles,
        winners,
        loading,
        mainRaffle,
        otherRaffles
    };
};

