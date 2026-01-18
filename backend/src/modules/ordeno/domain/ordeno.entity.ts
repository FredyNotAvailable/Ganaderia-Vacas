export interface Ordeno {
    ordeno_id: string;
    vaca_id: string;
    ganaderia_id: string;
    fecha: string;
    turno?: 'MANANA' | 'TARDE';
    litros: number;
    created_at?: string;
}

export interface IOrdenoRepository {
    create(ordeno: Partial<Ordeno>): Promise<Ordeno>;
    listByGanaderia(ganaderiaId: string): Promise<Ordeno[]>;
    update(id: string, ordeno: Partial<Ordeno>): Promise<Ordeno>;
    delete(id: string): Promise<void>;
}
