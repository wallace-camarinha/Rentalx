import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserTokens } from '../infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {
  create({
    expiresIn,
    refreshToken,
    userId,
  }: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserTokens>;

  deleteById(tokenId: string): Promise<void>;
}

export { IUsersTokensRepository };
