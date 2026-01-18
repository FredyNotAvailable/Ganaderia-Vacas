"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacaUseCase = void 0;
class VacaUseCase {
    constructor(vacaRepository) {
        this.vacaRepository = vacaRepository;
    }
    async createVaca(vaca) {
        return await this.vacaRepository.create(vaca);
    }
    async listVacas(ganaderiaId) {
        return await this.vacaRepository.listByGanaderia(ganaderiaId);
    }
    async updateVaca(id, vaca) {
        return await this.vacaRepository.update(id, vaca);
    }
}
exports.VacaUseCase = VacaUseCase;
