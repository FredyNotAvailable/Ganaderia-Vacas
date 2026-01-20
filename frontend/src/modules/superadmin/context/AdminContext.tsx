import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService, type AdminUser, type AdminGanaderia, type AdminRole } from '../services/admin.service';
import { useAuth } from '../../auth/AuthContext';

interface AdminContextType {
    users: AdminUser[];
    ganaderias: AdminGanaderia[];
    roles: AdminRole[];
    loading: boolean;
    refreshData: () => Promise<void>;
    updateUserInState: (userId: string, updates: Partial<AdminUser>) => void;
    removeAccessInState: (userId: string, ganaderiaId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { perfil } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [ganaderias, setGanaderias] = useState<AdminGanaderia[]>([]);
    const [roles, setRoles] = useState<AdminRole[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const refreshData = async () => {
        if (perfil?.rol_sistema !== 'SUPERADMIN') return;

        setLoading(true);
        try {
            const [usersData, ganaderiasData, rolesData] = await Promise.all([
                adminService.getUsers(),
                adminService.getGanaderias(),
                adminService.getRoles()
            ]);
            setUsers(usersData);
            setGanaderias(ganaderiasData);
            setRoles(rolesData);
            setHasLoaded(true);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (perfil?.rol_sistema === 'SUPERADMIN' && !hasLoaded) {
            refreshData();
        }
    }, [perfil, hasLoaded]);

    const updateUserInState = (userId: string, updates: Partial<AdminUser>) => {
        setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, ...updates } : u));
    };

    const removeAccessInState = (userId: string, ganaderiaId: string) => {
        setUsers(prev => prev.map(u => {
            if (u.user_id === userId) {
                return {
                    ...u,
                    accesses: u.accesses.filter(acc => acc.ganaderias.ganaderia_id !== ganaderiaId)
                };
            }
            return u;
        }));
    };

    return (
        <AdminContext.Provider value={{
            users,
            ganaderias,
            roles,
            loading: loading && !hasLoaded, // Only show loading if we haven't loaded yet
            refreshData,
            updateUserInState,
            removeAccessInState
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
