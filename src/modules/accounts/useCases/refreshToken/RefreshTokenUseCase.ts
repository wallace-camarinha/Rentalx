import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenReponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<ITokenReponse> {
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;
    const userId = sub;

    const userToken =
      await this.usersTokensRepository.findByUserAndRefreshToken(userId, token);

    if (!userToken) {
      throw new AppError('Refresh token not found!');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refreshToken = sign({ email }, auth.secret_refresh_token, {
      subject: userId,
      expiresIn: auth.expires_in_refresh_token,
    });
    const expiresIn = this.dateProvider.addDays(
      auth.expires_refresh_token_days,
    );

    await this.usersTokensRepository.create({
      userId,
      expiresIn,
      refreshToken,
    });

    const newToken = sign({}, auth.secret_token, {
      subject: userId,
      expiresIn: auth.expires_in_token,
    });

    return { token: newToken, refresh_token: refreshToken };
  }
}

export { RefreshTokenUseCase };
