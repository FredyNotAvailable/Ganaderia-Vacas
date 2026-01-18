"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanaderiaUseCase = void 0;
class GanaderiaUseCase {
    constructor(ganaderiaRepository) {
        this.ganaderiaRepository = ganaderiaRepository;
    }
    async getGanaderia(userId) {
        return await this.ganaderiaRepository.getByUserId(userId);
    }
    async updateGanaderia(userId, data) {
        return await this.ganaderiaRepository.update(userId, data);
    }
}
exports.GanaderiaUseCase = GanaderiaUseCase;
