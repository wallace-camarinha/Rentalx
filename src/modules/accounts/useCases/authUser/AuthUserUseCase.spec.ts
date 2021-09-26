import { AppError } from '@errors/AppError';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';

import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthUserUseCase } from './AuthUserUseCase';

let authUserUseCase: AuthUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('AuthUser', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authUserUseCase = new AuthUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authenticate a user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000123',
      email: 'user@test.com',
      password: '1234',
      name: 'User Test',
    };

    await createUserUseCase.execute(user);

    const result = await authUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('Should not be able to authenticate an nonexisting user', async () => {
    await expect(async () => {
      await authUserUseCase.execute({
        email: 'nonexisting@email.com',
        password: 'nonexisting',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate a user with the wrong password', async () => {
    const user: ICreateUserDTO = {
      driver_license: '9999',
      email: 'user@user.com',
      password: '1234',
      name: 'User Test Error',
    };

    await createUserUseCase.execute(user);

    await expect(async () => {
      await authUserUseCase.execute({
        email: user.email,
        password: 'nonexisting',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});