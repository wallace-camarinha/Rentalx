import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

interface IPayload {
  sub: string;
}

export async function ensureAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing!', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(
      token,
      '4c4637080adb0924c70cb81cb627a877',
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new AppError('User does not exist!', 401);
    }

    next();
  } catch {
    throw new AppError('Invalid token!', 401);
  }
  return response.send();
}