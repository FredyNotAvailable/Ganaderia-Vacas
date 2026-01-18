export interface Perfil {
    user_id: string; // PK matches SQL
    nombre: string;
    email: string;
    telefono?: string;
    created_at?: string;
}

export interface IPerfilRepository {
    getByUserId(userId: string): Promise<Perfil | null>;
    create(perfil: Partial<Perfil>): Promise<Perfil>;
    update(userId: string, perfil: Partial<Perfil>): Promise<Perfil>;
}
