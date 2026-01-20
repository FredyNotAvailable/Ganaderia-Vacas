import apiClient from '../../../shared/api/api.client';

export interface AdminUser {
    user_id: string;
    nombre: string;
    email: string;
    rol_sistema: string;
    accesses: {
        rol_id?: string;
        ganaderias: {
            nombre: string;
            ganaderia_id: string;
        };
        roles: {
            nombre: string;
            codigo: string;
        };
        is_owner?: boolean;
    }[];
}

export interface AdminGanaderia {
    ganaderia_id: string;
    nombre: string;
    ubicacion: string;
    propietario_user_id: string;
}

export interface AdminRole {
    rol_id: string;
    nombre: string;
    codigo: string;
}

export const adminService = {
    getUsers: async () => {
        const { data } = await apiClient.get<AdminUser[]>('/admin/users');
        return data;
    },
    getGanaderias: async () => {
        const { data } = await apiClient.get<AdminGanaderia[]>('/admin/ganaderias');
        return data;
    },
    getRoles: async () => {
        const { data } = await apiClient.get<AdminRole[]>('/admin/roles');
        return data;
    },
    assignAccess: async (userId: string, ganaderiaId: string, rolId: string) => {
        const { data } = await apiClient.post('/admin/access', { userId, ganaderiaId, rolId });
        return data;
    },
    removeAccess: async (userId: string, ganaderiaId: string) => {
        const { data } = await apiClient.delete(`/admin/access/${userId}/${ganaderiaId}`);
        return data;
    },
    updateUserRole: async (userId: string, rolSistema: string) => {
        const { data } = await apiClient.put(`/admin/users/${userId}/role`, { rolSistema });
        return data;
    }
};
