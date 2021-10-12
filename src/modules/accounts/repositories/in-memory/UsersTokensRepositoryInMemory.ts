import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserTokens';
import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '../IUsersTokensRepository';

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  userTokens: UserTokens[] = [];

  async create({
    expiresIn,
    refreshToken,
    userId,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, { expiresIn, refreshToken, userId });

    this.userTokens.push(userToken);

    return userToken;
  }

  async findByUserAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserTokens> {
    const userToken = this.userTokens.find(
      token => token.user_id === userId && token.refresh_token === refreshToken,
    );

    return userToken;
  }

  async deleteById(tokenId: string): Promise<void> {
    const userToken = this.userTokens.find(token => token.id === tokenId);
    this.userTokens.splice(this.userTokens.indexOf(userToken));
  }

  async findByRefreshToken(refreshToken: string): Promise<UserTokens> {
    const userToken = this.userTokens.find(
      token => token.refresh_token === refreshToken,
    );

    return userToken;
  }
}

export { UsersTokensRepositoryInMemory };
