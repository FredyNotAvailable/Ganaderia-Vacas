export interface Ganaderia {
    ganaderia_id: string;
    nombre: string;
    ubicacion?: string;
    propietario_user_id: string;
    created_at?: string;
}

export interface IGanaderiaRepository {
    getByUserId(userId: string): Promise<Ganaderia[]>;
    create(data: Partial<Ganaderia>): Promise<Ganaderia>;
    update(ganaderiaId: string, data: Partial<Ganaderia>): Promise<Ganaderia>;
    delete(ganaderiaId: string): Promise<void>;
}
