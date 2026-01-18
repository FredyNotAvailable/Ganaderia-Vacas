import { IGanaderiaRepository, Ganaderia } from '../domain/ganaderia.entity';

export class GanaderiaUseCase {
    constructor(private ganaderiaRepository: IGanaderiaRepository) { }

    async getGanaderias(userId: string): Promise<Ganaderia[]> {
        return await this.ganaderiaRepository.getByUserId(userId);
    }

    async updateGanaderia(ganaderiaId: string, data: Partial<Ganaderia>): Promise<Ganaderia> {
        return await this.ganaderiaRepository.update(ganaderiaId, data);
    }

    async deleteGanaderia(ganaderiaId: string): Promise<void> {
        return await this.ganaderiaRepository.delete(ganaderiaId);
    }

    async createGanaderia(data: Partial<Ganaderia>): Promise<Ganaderia> {
        return await this.ganaderiaRepository.create(data);
    }
}
