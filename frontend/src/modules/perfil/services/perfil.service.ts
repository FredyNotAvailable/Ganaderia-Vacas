import apiClient from '../../../shared/api/api.client';

export interface Perfil {
    perfil_id: string;
    user_id: string;
    nombre: string;
    email: string;
    telefono?: string;
    updated_at: string;
}

export const perfilService = {
    getProfile: async () => {
        const { data } = await apiClient.get<Perfil>('/perfil');
        return data;
    },

    updateProfile: async (perfil: Partial<Perfil>) => {
        const { data } = await apiClient.put<Perfil>('/perfil', perfil);
        return data;
    }
};
