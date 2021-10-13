import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import { ListCategoriesUseCase } from './ListCategoriesUseCase';

let listCategoriesUseCase: ListCategoriesUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('List Categories Use Case', () => {
  it('Should be able to list all categories', async () => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    listCategoriesUseCase = new ListCategoriesUseCase(
      categoriesRepositoryInMemory,
    );

    await categoriesRepositoryInMemory.create({
      name: 'Test Category',
      description: 'Test Description',
    });

    const categories = await listCategoriesUseCase.execute();

    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Test Category');
  });
});
