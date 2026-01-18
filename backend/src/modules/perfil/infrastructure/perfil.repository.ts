import { supabase } from '../../../shared/supabase/supabase.client';
import { IPerfilRepository, Perfil } from '../domain/perfil.entity';

export class SupabasePerfilRepository implements IPerfilRepository {
    private readonly table = 'perfiles';

    async getByUserId(userId: string): Promise<Perfil | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw new Error(error.message);
        }
        return data;
    }

    async create(perfil: Partial<Perfil>): Promise<Perfil> {
        const { data, error } = await supabase
            .from(this.table)
            .insert(perfil)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async update(userId: string, perfil: Partial<Perfil>): Promise<Perfil> {
        const { data, error } = await supabase
            .from(this.table)
            .update(perfil)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
}
