import { Request, Response } from 'express';

import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

class ListCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  execute(request: Request, response: Response): Response {
    const categories = this.categoriesRepository.list();

    return response.json(categories);
  }
}

export { ListCategoriesUseCase };
