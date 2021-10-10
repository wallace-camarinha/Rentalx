import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
    start_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date,
      start_date,
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findOpenRentalByCar(carId: string): Promise<Rental> {
    const rental = await this.repository.findOne({
      where: { car_id: carId, end_date: null },
    });
    return rental;
  }

  async findOpenRentalByUser(userId: string): Promise<Rental> {
    const rental = await this.repository.findOne({
      where: { user_id: userId, end_date: null },
    });
    return rental;
  }

  async findById(rentalId: string): Promise<Rental> {
    const rental = await this.repository.findOne(rentalId);

    return rental;
  }

  async findByUser(userId: string): Promise<Rental[]> {
    const rental = await this.repository.find({
      where: { user_id: userId },
      relations: ['car'],
    });

    return rental;
  }
}

export { RentalsRepository };
