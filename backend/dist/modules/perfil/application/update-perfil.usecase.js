"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePerfilUseCase = void 0;
class UpdatePerfilUseCase {
    constructor(perfilRepository) {
        this.perfilRepository = perfilRepository;
    }
    async execute(userId, data) {
        // Optionally add business logic validation here
        return await this.perfilRepository.update(userId, data);
    }
    async getProfile(userId) {
        return await this.perfilRepository.getByUserId(userId);
    }
    async createProfile(data) {
        return await this.perfilRepository.create(data);
    }
}
exports.UpdatePerfilUseCase = UpdatePerfilUseCase;
