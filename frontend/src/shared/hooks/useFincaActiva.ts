import { useGanaderia } from '../context/GanaderiaContext';

export const useFincaActiva = () => {
    const {
        ganaderia: fincaActiva,
        ganaderias,
        misGanaderias,
        ganaderiasVinculadas,
        selectGanaderia,
        loading
    } = useGanaderia();

    return {
        fincaActiva,
        todasLasFincas: ganaderias,
        misFincas: misGanaderias,
        fincasVinculadas: ganaderiasVinculadas,
        cambiarFinca: selectGanaderia,
        cargandoFincas: loading
    };
};
