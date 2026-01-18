import { IPerfilRepository, Perfil } from '../domain/perfil.entity';

export class UpdatePerfilUseCase {
    constructor(private perfilRepository: IPerfilRepository) { }

    async execute(userId: string, data: Partial<Perfil>): Promise<Perfil> {
        // Optionally add business logic validation here
        return await this.perfilRepository.update(userId, data);
    }

    async getProfile(userId: string): Promise<Perfil | null> {
        return await this.perfilRepository.getByUserId(userId);
    }

    async createProfile(data: Partial<Perfil>): Promise<Perfil> {
        return await this.perfilRepository.create(data);
    }
}
