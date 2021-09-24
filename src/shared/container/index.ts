import { container } from 'tsyringe';

import { ICategoriesRepository } from '../../modules/cars/repositories/ICategoriesRepository';
import { CategoriesRepository } from '../../modules/cars/repositories/implementations/CategoriesRepository';

import { ISpecificationsRepository } from '../../modules/cars/repositories/ISpecificationRepository';
import { SpecificationsRepository } from '../../modules/cars/repositories/implementations/SpecificationRepository';

import { IUsersRepository } from '../../modules/accounts/repositories/IUsesRepository';
import { UsersRepository } from '../../modules/accounts/repositories/implementations/UsersRepository';

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<ISpecificationsRepository>(
  'SpecificationsRepository',
  SpecificationsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
