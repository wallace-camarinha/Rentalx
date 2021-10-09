import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { RentalReturnUseCase } from './RentalReturnUseCase';

class RentalReturnController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { id } = request.params;
    const rentalReturnUseCase = container.resolve(RentalReturnUseCase);

    const returnRental = await rentalReturnUseCase.execute({ id, user_id });

    return response.status(200).json(returnRental);
  }
}

export { RentalReturnController };
