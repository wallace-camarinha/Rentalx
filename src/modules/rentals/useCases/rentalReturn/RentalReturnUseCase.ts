import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class RentalReturnUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);
    const minimumDaily = 1;
    const dateNow = this.dateProvider.dateNow();

    if (!rental) {
      throw new AppError('Rental not found!');
    }

    let rentedPeriodInDays = this.dateProvider.compareInDays(
      rental.start_date,
      dateNow,
    );
    console.log(rentedPeriodInDays);

    if (rentedPeriodInDays <= 0) {
      rentedPeriodInDays = minimumDaily;
    }

    const delayedDays = this.dateProvider.compareInDays(
      rental.expected_return_date,
      dateNow,
    );

    let total = 0;

    if (delayedDays > 0) {
      const calculateFee = delayedDays * car.fine_amount;
      total = calculateFee;
    }

    total += rentedPeriodInDays * car.daily_rate;

    rental.end_date = dateNow;
    rental.updated_at = dateNow;
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateStatus(rental.car_id, true);

    return rental;
  }
}

export { RentalReturnUseCase };
