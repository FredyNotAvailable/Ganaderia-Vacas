import { supabase } from '../../../shared/supabase/supabase.client';
import { IOrdenoRepository, Ordeno } from '../domain/ordeno.entity';

export class SupabaseOrdenoRepository implements IOrdenoRepository {
    private readonly table = 'ordenos';

    async create(ordeno: Partial<Ordeno>): Promise<Ordeno> {
        const { data, error } = await supabase
            .from(this.table)
            .insert(ordeno)
            .select('*, vaca:vacas(nombre)')
            .single();

        if (error) throw new Error(error.message);
        return data as unknown as Ordeno;
    }

    async listByGanaderia(ganaderiaId: string): Promise<Ordeno[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*, vaca:vacas(nombre)')
            .eq('ganaderia_id', ganaderiaId)
            .order('fecha_ordeno', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }

    async update(id: string, ordeno: Partial<Ordeno>): Promise<Ordeno> {
        const { data, error } = await supabase
            .from(this.table)
            .update(ordeno)
            .eq('ordeno_id', id)
            .select('*, vaca:vacas(nombre)')
            .single();

        if (error) throw new Error(error.message);
        return data as unknown as Ordeno;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('ordeno_id', id);

        if (error) throw new Error(error.message);
    }
}
