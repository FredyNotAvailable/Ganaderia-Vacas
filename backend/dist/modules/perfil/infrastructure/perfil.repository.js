"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabasePerfilRepository = void 0;
const supabase_client_1 = require("../../../shared/supabase/supabase.client");
class SupabasePerfilRepository {
    constructor() {
        this.table = 'perfiles';
    }
    async getByUserId(userId) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // Not found
            throw new Error(error.message);
        }
        return data;
    }
    async update(userId, perfil) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .update(perfil)
            .eq('user_id', userId)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
}
exports.SupabasePerfilRepository = SupabasePerfilRepository;
