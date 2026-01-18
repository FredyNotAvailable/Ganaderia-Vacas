import { IOrdenoRepository, Ordeno } from '../domain/ordeno.entity';

export class OrdenoUseCase {
    constructor(private ordenoRepository: IOrdenoRepository) { }

    async createOrdeno(ordeno: Partial<Ordeno>): Promise<Ordeno> {
        return await this.ordenoRepository.create(ordeno);
    }

    async listOrdenos(ganaderiaId: string): Promise<Ordeno[]> {
        return await this.ordenoRepository.listByGanaderia(ganaderiaId);
    }

    async updateOrdeno(id: string, ordeno: Partial<Ordeno>): Promise<Ordeno> {
        return await this.ordenoRepository.update(id, ordeno);
    }

    async deleteOrdeno(id: string): Promise<void> {
        return await this.ordenoRepository.delete(id);
    }
}
