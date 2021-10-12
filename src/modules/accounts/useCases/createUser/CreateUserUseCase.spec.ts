import { AppError } from '@shared/errors/AppError';

import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let usersRepository: UsersRepositoryInMemory;

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('Should be able to create a new user', async () => {
    await createUserUseCase.execute({
      driver_license: '729264',
      name: 'Joseph Rodriquez',
      email: 'gule@hakmuha.vg',
      password: '123',
    });

    const user = await usersRepository.findByEmail('gule@hakmuha.vg');

    expect(user).toHaveProperty('id');
    expect(user.name).toEqual('Joseph Rodriquez');
  });

  it('Should not be able to create a new user with and already user e-mail', async () => {
    await createUserUseCase.execute({
      driver_license: '673846',
      name: 'Eva King',
      email: 'gule@hakmuha.vg',
      password: '123',
    });

    await expect(
      createUserUseCase.execute({
        driver_license: '729264',
        name: 'Joseph Rodriquez',
        email: 'gule@hakmuha.vg',
        password: '123',
      }),
    ).rejects.toEqual(new AppError('User already exists!'));
  });
});
