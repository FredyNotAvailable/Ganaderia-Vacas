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
            .select('*, vaca:vacas(nombre)')
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async listByGanaderia(ganaderiaId) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .select('*, vaca:vacas(nombre)')
            .eq('ganaderia_id', ganaderiaId)
            .order('fecha_ordeno', { ascending: false });
        if (error)
            throw new Error(error.message);
        return data || [];
    }
    async update(id, ordeno) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .update(ordeno)
            .eq('ordeno_id', id)
            .select('*, vaca:vacas(nombre)')
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async delete(id) {
        const { error } = await supabase_client_1.supabase
            .from(this.table)
            .delete()
            .eq('ordeno_id', id);
        if (error)
            throw new Error(error.message);
    }
}
exports.SupabaseOrdenoRepository = SupabaseOrdenoRepository;
