"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanaderiaUseCase = void 0;
class GanaderiaUseCase {
    constructor(ganaderiaRepository) {
        this.ganaderiaRepository = ganaderiaRepository;
    }
    async getGanaderias(userId) {
        return await this.ganaderiaRepository.getByUserId(userId);
    }
    async updateGanaderia(ganaderiaId, data) {
        return await this.ganaderiaRepository.update(ganaderiaId, data);
    }
    async deleteGanaderia(ganaderiaId) {
        return await this.ganaderiaRepository.delete(ganaderiaId);
    }
    async createGanaderia(data) {
        return await this.ganaderiaRepository.create(data);
    }
}
exports.GanaderiaUseCase = GanaderiaUseCase;
