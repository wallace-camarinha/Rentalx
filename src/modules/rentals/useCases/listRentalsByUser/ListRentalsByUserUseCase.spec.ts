import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let listRentalsByUseUseCase: ListRentalsByUserUseCase;

describe('List Rentals By User Use Case', () => {
  it('Should be able to list all rentals filtered by the user', async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    listRentalsByUseUseCase = new ListRentalsByUserUseCase(
      rentalsRepositoryInMemory,
    );

    const rental = await rentalsRepositoryInMemory.create({
      car_id: 'test_car',
      user_id: 'test_user',
      start_date: new Date(),
      expected_return_date: new Date(2093, 9, 7),
    });

    expect(rental).toHaveProperty('id');
  });
});
