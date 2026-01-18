"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseGanaderiaRepository = void 0;
const supabase_client_1 = require("../../../shared/supabase/supabase.client");
class SupabaseGanaderiaRepository {
    constructor() {
        this.table = 'ganaderias';
    }
    async getByUserId(userId) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .select('*')
            .eq('propietario_user_id', userId)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null;
            throw new Error(error.message);
        }
        return data;
    }
    async update(userId, data) {
        const { data: updated, error } = await supabase_client_1.supabase
            .from(this.table)
            .update(data)
            .eq('propietario_user_id', userId)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return updated;
    }
}
exports.SupabaseGanaderiaRepository = SupabaseGanaderiaRepository;
