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
}
exports.OrdenoUseCase = OrdenoUseCase;
