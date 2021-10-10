import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { RentalsRepository } from '@modules/rentals/infra/typeorm/repositories/RentalsRepository';

@injectable()
class ListRentalsByUserUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: RentalsRepository,
  ) {}

  async execute(userId: string): Promise<Rental[]> {
    const rentalsByUser = await this.rentalsRepository.findByUser(userId);

    return rentalsByUser;
  }
}

export { ListRentalsByUserUseCase };
