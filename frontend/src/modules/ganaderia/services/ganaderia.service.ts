import apiClient from '../../../shared/api/api.client';
import { type Ganaderia, type UpdateGanaderiaDTO, type CreateGanaderiaDTO } from '../models';

export const ganaderiaService = {
    getGanaderia: async () => {
        const { data } = await apiClient.get<Ganaderia[]>('/ganaderia');
        return data;
    },

    updateGanaderia: async (id: string, ganaderia: UpdateGanaderiaDTO) => {
        const { data } = await apiClient.put<Ganaderia>(`/ganaderia/${id}`, ganaderia);
        return data;
    },

    createGanaderia: async (ganaderia: CreateGanaderiaDTO) => {
        const { data } = await apiClient.post<Ganaderia>('/ganaderia', ganaderia);
        return data;
    },

    deleteGanaderia: async (id: string) => {
        await apiClient.delete(`/ganaderia/${id}`);
    }
};
