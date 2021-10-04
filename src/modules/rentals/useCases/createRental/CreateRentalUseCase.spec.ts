import dayjs from 'dayjs';
import { AppError } from '@shared/errors/AppError';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('CreateRental', () => {
  const dayAdd24hours = dayjs().add(1, 'day').toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it('Should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '4321',
      start_date: new Date(),
      expected_return_date: dayAdd24hours,
    });

    expect(rental).toHaveProperty('id');
  });

  it('Should not be able to create a new rental for a user with an open rental', async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'userIdTest',
        car_id: '4321',
        start_date: new Date(),
        expected_return_date: dayAdd24hours,
      });

      await createRentalUseCase.execute({
        user_id: 'userIdTest',
        car_id: '0000',
        start_date: new Date(),
        expected_return_date: dayAdd24hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental for a car with an open rental', async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'carIdTest',
        start_date: new Date(),
        expected_return_date: dayAdd24hours,
      });

      await createRentalUseCase.execute({
        user_id: '00000',
        car_id: 'carIdTest',
        start_date: new Date(),
        expected_return_date: dayAdd24hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental with an invalid return date', async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'carIdTest',
        start_date: new Date(),
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
