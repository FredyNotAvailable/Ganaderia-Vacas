import { supabase } from '../../../shared/supabase/supabase.client';
import { IGanaderiaRepository, Ganaderia } from '../domain/ganaderia.entity';

export class SupabaseGanaderiaRepository implements IGanaderiaRepository {
    private readonly table = 'ganaderias';

    async getByUserId(userId: string): Promise<Ganaderia[]> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('propietario_user_id', userId);

        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }

    async create(data: Partial<Ganaderia>): Promise<Ganaderia> {
        const { data: newGanaderia, error } = await supabase
            .from(this.table)
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return newGanaderia;
    }

    async update(ganaderiaId: string, data: Partial<Ganaderia>): Promise<Ganaderia> {
        const { data: updated, error } = await supabase
            .from(this.table)
            .update(data)
            .eq('ganaderia_id', ganaderiaId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return updated;
    }

    async delete(ganaderiaId: string): Promise<void> {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('ganaderia_id', ganaderiaId);

        if (error) throw new Error(error.message);
    }
}
