import { IVacaRepository, Vaca } from '../domain/vaca.entity';

export class VacaUseCase {
    constructor(private vacaRepository: IVacaRepository) { }

    async createVaca(vaca: Partial<Vaca>): Promise<Vaca> {
        return await this.vacaRepository.create(vaca);
    }

    async listVacas(ganaderiaId: string): Promise<Vaca[]> {
        return await this.vacaRepository.listByGanaderia(ganaderiaId);
    }

    async updateVaca(id: string, vaca: Partial<Vaca>): Promise<Vaca> {
        return await this.vacaRepository.update(id, vaca);
    }

    async deleteVaca(id: string): Promise<void> {
        return await this.vacaRepository.delete(id);
    }
}
