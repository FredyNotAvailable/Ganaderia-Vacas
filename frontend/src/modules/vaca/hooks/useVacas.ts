import { useState, useEffect, useCallback } from 'react';
import { vacaService } from '../services/vaca.service';
import { type Vaca } from '../models';
import { useToast } from '@chakra-ui/react';

export const useVacas = (ganaderiaId?: string) => {
    const [vacas, setVacas] = useState<Vaca[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchVacas = useCallback(async () => {
        if (!ganaderiaId) return;

        setLoading(true);
        try {
            const data = await vacaService.getVacas(ganaderiaId);
            setVacas(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            toast({
                title: 'Error al cargar vacas',
                description: err.message,
                status: 'error',
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [ganaderiaId, toast]);

    useEffect(() => {
        if (ganaderiaId) {
            fetchVacas();
        }
    }, [fetchVacas, ganaderiaId]);

    return {
        vacas,
        loading,
        error,
        refetch: fetchVacas,
        setVacas
    };
};
