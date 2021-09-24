import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthUserUseCase } from './AuthUserUseCase';

class AuthUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const authUserUseCase = container.resolve(AuthUserUseCase);
    const { password, email } = request.body;

    const token = await authUserUseCase.execute({ password, email });

    return response.json(token);
  }
}

export { AuthUserController };
