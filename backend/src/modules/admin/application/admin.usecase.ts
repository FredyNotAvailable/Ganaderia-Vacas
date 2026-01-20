import { AdminRepository } from '../infrastructure/admin.repository';

export class AdminUseCase {
    constructor(private adminRepo: AdminRepository) { }

    async getUsers() {
        return await this.adminRepo.getAllUsers();
    }

    async getGanaderias() {
        return await this.adminRepo.getAllGanaderias();
    }

    async getRoles() {
        return await this.adminRepo.getAllRoles();
    }

    async assignAccess(userId: string, ganaderiaId: string, rolId: string) {
        return await this.adminRepo.assignAccess(userId, ganaderiaId, rolId);
    }

    async removeAccess(userId: string, ganaderiaId: string) {
        return await this.adminRepo.removeAccess(userId, ganaderiaId);
    }

    async updateUserRole(userId: string, rolSistema: string) {
        return await this.adminRepo.updateUserRole(userId, rolSistema);
    }
}
