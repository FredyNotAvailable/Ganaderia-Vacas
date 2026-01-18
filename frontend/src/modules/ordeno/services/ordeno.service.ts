import apiClient from '../../../shared/api/api.client';
import { type CreateOrdenoDTO, type Ordeno } from '../models';

export const ordenoService = {
    getOrdenos: async (ganaderiaId: string) => {
        const { data } = await apiClient.get<Ordeno[]>('/ordenos', {
            params: { ganaderia_id: ganaderiaId }
        });
        return data;
    },

    createOrdeno: async (ordeno: CreateOrdenoDTO) => {
        const { data } = await apiClient.post<Ordeno>('/ordenos', ordeno);
        return data;
    },

    updateOrdeno: async (id: string, ordeno: Partial<CreateOrdenoDTO>) => {
        const { data } = await apiClient.put<Ordeno>(`/ordenos/${id}`, ordeno);
        return data;
    },

    deleteOrdeno: async (id: string) => {
        await apiClient.delete(`/ordenos/${id}`);
    }
};
