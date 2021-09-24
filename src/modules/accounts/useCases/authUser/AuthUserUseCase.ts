import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../errors/AppError';

import { IUsersRepository } from '../../repositories/IUsesRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Email/Password incorrect!');
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Email/Password incorrect!');
    }

    const token = sign({}, '4c4637080adb0924c70cb81cb627a877', {
      subject: user.id,
      expiresIn: '1d',
    });

    const returnToken: IResponse = {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };

    return returnToken;
  }
}

export { AuthUserUseCase };
