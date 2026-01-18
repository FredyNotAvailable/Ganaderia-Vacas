import { supabase } from '../../../shared/supabase/supabase.client';
import { IVacaRepository, Vaca } from '../domain/vaca.entity';

export class SupabaseVacaRepository implements IVacaRepository {
    private readonly table = 'vacas';

    async create(vaca: Partial<Vaca>): Promise<Vaca> {
        const { data, error } = await supabase
            .from(this.table)
            .insert(vaca)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async listByGanaderia(ganaderiaId: string): Promise<Vaca[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('ganaderia_id', ganaderiaId);

        if (error) throw new Error(error.message);
        return data || [];
    }

    async update(id: string, vaca: Partial<Vaca>): Promise<Vaca> {
        const { data, error } = await supabase
            .from(this.table)
            .update(vaca)
            .eq('vaca_id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('vaca_id', id);

        if (error) throw new Error(error.message);
    }
}
