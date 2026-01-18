import apiClient from '../../../shared/api/api.client';
import { type CreateVacaDTO, type UpdateVacaDTO, type Vaca } from '../models';

export const vacaService = {
    getVacas: async (ganaderiaId: string) => {
        const { data } = await apiClient.get<Vaca[]>('/vacas', {
            params: { ganaderia_id: ganaderiaId }
        });
        return data;
    },

    createVaca: async (vaca: CreateVacaDTO) => {
        const { data } = await apiClient.post<Vaca>('/vacas', vaca);
        return data;
    },

    updateVaca: async (id: string, vaca: UpdateVacaDTO) => {
        const { data } = await apiClient.put<Vaca>(`/vacas/${id}`, vaca);
        return data;
    },

    deleteVaca: async (id: string) => {
        await apiClient.delete(`/vacas/${id}`);
    }
};
