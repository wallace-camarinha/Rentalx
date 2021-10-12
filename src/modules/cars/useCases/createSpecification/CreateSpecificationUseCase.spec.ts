import { AppError } from '@shared/errors/AppError';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

let createSpecificationUseCase: CreateSpecificationUseCase;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Specification', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory,
    );
  });

  it('Should be able create a new specification', async () => {
    const specification = await createSpecificationUseCase.execute({
      name: 'Test Specification',
      description: 'Specification description test',
    });

    expect(specification).toHaveProperty('id');
    expect(specification.name).toEqual('Test Specification');
  });

  it('Should not be able create a specification with an already used name', async () => {
    await createSpecificationUseCase.execute({
      name: 'Some Specification',
      description: 'Specification description test',
    });

    await expect(
      createSpecificationUseCase.execute({
        name: 'Some Specification',
        description: 'Specification description test',
      }),
    ).rejects.toEqual(new AppError('Specification already exists!'));
  });
});
