import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('ListCars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  it('Should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test 1',
      description: 'Cool car 1',
      daily_rate: 140,
      fine_amount: 70,
      license_plate: 'CAR0001',
      brand: 'Test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by the car's brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test 2',
      description: 'Cool car 2',
      daily_rate: 140,
      fine_amount: 70,
      license_plate: 'CAR0002',
      brand: 'car_brand_test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'car_brand_test',
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by the car's name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test 3',
      description: 'Cool car 3',
      daily_rate: 140,
      fine_amount: 70,
      license_plate: 'CAR0003',
      brand: 'Test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Test 3',
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by the car's category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test 4',
      description: 'Cool car 4',
      daily_rate: 140,
      fine_amount: 70,
      license_plate: 'CAR0004',
      brand: 'Test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category_id',
    });

    expect(cars).toEqual([car]);
  });
});
