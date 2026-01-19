"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenoUseCase = void 0;
class OrdenoUseCase {
    constructor(ordenoRepository) {
        this.ordenoRepository = ordenoRepository;
    }
    async createOrdeno(ordeno) {
        return await this.ordenoRepository.create(ordeno);
    }
    async listOrdenos(ganaderiaId) {
        return await this.ordenoRepository.listByGanaderia(ganaderiaId);
    }
    async updateOrdeno(id, ordeno) {
        return await this.ordenoRepository.update(id, ordeno);
    }
    async deleteOrdeno(id) {
        return await this.ordenoRepository.delete(id);
    }
}
exports.OrdenoUseCase = OrdenoUseCase;
