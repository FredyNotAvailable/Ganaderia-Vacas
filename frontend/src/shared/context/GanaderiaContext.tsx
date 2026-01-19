import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ganaderiaService } from '../../modules/ganaderia/services/ganaderia.service';
import { type Ganaderia } from '../../modules/ganaderia/models';
import { type Vaca } from '../../modules/vaca/models';
import { type Ordeno } from '../../modules/ordeno/models';
import { useAuth } from '../../modules/auth/AuthContext';
interface GanaderiaContextType {
    ganaderia: Ganaderia | null; // Selected one
    ganaderias: Ganaderia[];     // List of all
    loading: boolean;
    refreshGanaderia: () => Promise<void>;
    selectGanaderia: (id: string) => void;
    // Permisos
    permiso: string | null;
    esPropietario: boolean;
    rolDetalle?: {
        id: string;
        nombre: string;
        codigo: string;
    };
    // Groups
    misGanaderias: Ganaderia[];
    ganaderiasVinculadas: Ganaderia[];
    // Vacas Sync
    vacas: Vaca[];
    vacasLoading: boolean;
    refreshVacas: (force?: boolean) => Promise<void>;
    addVaca: (vaca: Vaca) => void;
    updateVaca: (vaca: Vaca) => void;
    removeVaca: (id: string) => void;
    // Milking Sync
    ordenos: Ordeno[];
    ordenosLoading: boolean;
    refreshOrdenos: (force?: boolean) => Promise<void>;
    addOrdeno: (ordeno: Ordeno) => void;
    updateOrdeno: (ordeno: Ordeno) => void;
    removeOrdeno: (id: string) => void;
}

const GanaderiaContext = createContext<GanaderiaContextType | undefined>(undefined);

export const GanaderiaProvider = ({ children }: { children: ReactNode }) => {
    const [ganaderias, setGanaderias] = useState<Ganaderia[]>([]);
    const [selectedGanaderia, setSelectedGanaderia] = useState<Ganaderia | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Vacas State
    const [vacas, setVacas] = useState<Vaca[]>([]);
    const [vacasLoading, setVacasLoading] = useState(false);

    // Milking State
    const [ordenos, setOrdenos] = useState<Ordeno[]>([]);
    const [ordenosLoading, setOrdenosLoading] = useState(false);

    const fetchGanaderias = async () => {
        if (!user) {
            setLoading(false);
            setGanaderias([]);
            setSelectedGanaderia(null);
            setVacas([]);
            setOrdenos([]);
            return;
        }

        // Si ya tenemos datos, no mostramos el spinner global para evitar parpadeos
        if (ganaderias.length === 0) setLoading(true);

        try {
            const data = await ganaderiaService.getGanaderia();
            const list = Array.isArray(data) ? data : [];
            setGanaderias(list);

            if (list.length > 0) {
                const savedId = localStorage.getItem('ganaderiaActivaId');
                const savedGanaderia = list.find(g => g.ganaderia_id === savedId);

                // Solo actualizar si no hay nada seleccionado o si lo que estaba seleccionado ya no es válido
                const currentId = selectedGanaderia?.ganaderia_id;
                const stillExists = currentId ? list.find(g => g.ganaderia_id === currentId) : null;

                if (!currentId || !stillExists) {
                    if (savedGanaderia) {
                        setSelectedGanaderia(savedGanaderia);
                    } else {
                        const own = list.find(g => g.rol === 'DUEÑO');
                        setSelectedGanaderia(own || list[0]);
                    }
                } else if (stillExists) {
                    // Actualizar el objeto pero mantener la selección estable
                    setSelectedGanaderia(stillExists);
                }
            } else {
                setSelectedGanaderia(null);
            }
        } catch (error) {
            console.error(error);
            if (ganaderias.length === 0) setGanaderias([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchVacas = async (force = false) => {
        if (!selectedGanaderia) {
            setVacas([]);
            return;
        }

        // Avoid re-fetching if we already have data for this ganaderia and it's not a force refresh
        if (!force && vacas.length > 0 && vacas[0].ganaderia_id === selectedGanaderia.ganaderia_id) {
            return;
        }

        try {
            if (vacas.length === 0 || force) setVacasLoading(true);
            const { vacaService } = await import('../../modules/vaca/services/vaca.service');
            const data = await vacaService.getVacas(selectedGanaderia.ganaderia_id);
            setVacas(data);
        } catch (error) {
            console.error(error);
        } finally {
            setVacasLoading(false);
        }
    };

    const fetchOrdenos = async (force = false) => {
        if (!selectedGanaderia) {
            setOrdenos([]);
            return;
        }

        // Avoid re-fetching if we already have data for this ganaderia and it's not a force refresh
        if (!force && ordenos.length > 0 && ordenos[0].ganaderia_id === selectedGanaderia.ganaderia_id) {
            return;
        }

        try {
            if (ordenos.length === 0 || force) setOrdenosLoading(true);
            const { ordenoService } = await import('../../modules/ordeno/services/ordeno.service');
            const data = await ordenoService.getOrdenos(selectedGanaderia.ganaderia_id);
            setOrdenos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setOrdenosLoading(false);
        }
    };

    const selectGanaderia = (id: string) => {
        const found = ganaderias.find(g => g.ganaderia_id === id);
        if (found && found.ganaderia_id !== selectedGanaderia?.ganaderia_id) {
            setSelectedGanaderia(found);
            localStorage.setItem('ganaderiaActivaId', id);
            // reset caches to trigger fresh load for new ganaderia
            setVacas([]);
            setOrdenos([]);
        }
    };

    useEffect(() => {
        fetchGanaderias();
    }, [user?.id]);

    useEffect(() => {
        if (selectedGanaderia) {
            localStorage.setItem('ganaderiaActivaId', selectedGanaderia.ganaderia_id);
            fetchVacas();
            fetchOrdenos();
        }
    }, [selectedGanaderia?.ganaderia_id]);

    return (
        <GanaderiaContext.Provider value={{
            ganaderia: selectedGanaderia,
            ganaderias,
            loading,
            refreshGanaderia: fetchGanaderias,
            selectGanaderia,
            permiso: selectedGanaderia?.permiso || null,
            esPropietario: selectedGanaderia?.rol === 'DUEÑO',
            rolDetalle: selectedGanaderia?.rol_detalle,
            misGanaderias: ganaderias.filter(g => g.rol === 'DUEÑO'),
            ganaderiasVinculadas: ganaderias.filter(g => g.rol === 'COMPARTIDA'),
            vacas,
            vacasLoading,
            refreshVacas: fetchVacas,
            addVaca: (vaca) => setVacas(prev => [vaca, ...prev]),
            updateVaca: (vaca) => setVacas(prev => prev.map(v => v.vaca_id === vaca.vaca_id ? vaca : v)),
            removeVaca: (id) => setVacas(prev => prev.filter(v => v.vaca_id !== id)),
            ordenos,
            ordenosLoading,
            refreshOrdenos: fetchOrdenos,
            addOrdeno: (ordeno) => setOrdenos(prev => [ordeno, ...prev]),
            updateOrdeno: (ordeno) => setOrdenos(prev => prev.map(o => o.ordeno_id === ordeno.ordeno_id ? ordeno : o)),
            removeOrdeno: (id) => setOrdenos(prev => prev.filter(o => o.ordeno_id !== id))
        }}>
            {children}
        </GanaderiaContext.Provider>
    );
};

export const useGanaderia = () => {
    const context = useContext(GanaderiaContext);
    if (context === undefined) {
        throw new Error('useGanaderia must be used within a GanaderiaProvider');
    }
    return context;
};
