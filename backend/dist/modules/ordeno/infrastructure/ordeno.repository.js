"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseOrdenoRepository = void 0;
const supabase_client_1 = require("../../../shared/supabase/supabase.client");
class SupabaseOrdenoRepository {
    constructor() {
        this.table = 'ordenos';
    }
    async create(ordeno) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .insert(ordeno)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async listByGanaderia(ganaderiaId) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .select('*')
            .eq('ganaderia_id', ganaderiaId);
        if (error)
            throw new Error(error.message);
        return data || [];
    }
}
exports.SupabaseOrdenoRepository = SupabaseOrdenoRepository;
