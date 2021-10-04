import { inject, injectable } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

interface IRequest {
  user_id: string;
  car_id: string;
  start_date: Date;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({
    user_id,
    car_id,
    start_date,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minimumHour = 24;

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id,
    );
    if (carUnavailable) {
      throw new AppError('This car is not available!');
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
      user_id,
    );
    if (rentalOpenToUser) {
      throw new AppError('This user has an open rental!');
    }

    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date,
    );
    if (compare < minimumHour) {
      throw new AppError(
        'Invalid return date! A rental must be at least 24h long.',
      );
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      start_date,
      expected_return_date,
    });

    await this.carsRepository.updateStatus(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
