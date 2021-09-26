import { AppError } from '@shared/errors/AppError';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepository: CarsRepositoryInMemory;

describe('CreateCar', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepository);
  });

  it('Should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car name',
      description: 'Car description',
      daily_rate: 100,
      brand: 'Brand',
      category_id: 'category_id',
      fine_amount: 60,
      license_plate: 'ABC-1234',
    });

    expect(car).toHaveProperty('id');
  });

  it('Should not be able to create a car with an already used license plate', async () => {
    await expect(async () => {
      await createCarUseCase.execute({
        name: 'Car 2',
        description: 'Car 2 description',
        daily_rate: 100,
        brand: 'Brand',
        category_id: 'category_id',
        fine_amount: 60,
        license_plate: 'ABC-1234',
      });

      await createCarUseCase.execute({
        name: 'Car 2',
        description: 'Car 2 description',
        daily_rate: 100,
        brand: 'Brand',
        category_id: 'category_id',
        fine_amount: 60,
        license_plate: 'ABC-1234',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should create a new car with "available": "true" by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Available',
      description: 'Car description',
      daily_rate: 100,
      brand: 'Brand',
      category_id: 'category_id',
      fine_amount: 60,
      license_plate: 'BCD-1234',
    });

    expect(car.available).toBe(true);
  });
});
