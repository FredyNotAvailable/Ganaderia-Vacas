"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseVacaRepository = void 0;
const supabase_client_1 = require("../../../shared/supabase/supabase.client");
class SupabaseVacaRepository {
    constructor() {
        this.table = 'vacas';
    }
    async create(vaca) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .insert(vaca)
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
    async update(id, vaca) {
        const { data, error } = await supabase_client_1.supabase
            .from(this.table)
            .update(vaca)
            .eq('vaca_id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
}
exports.SupabaseVacaRepository = SupabaseVacaRepository;
