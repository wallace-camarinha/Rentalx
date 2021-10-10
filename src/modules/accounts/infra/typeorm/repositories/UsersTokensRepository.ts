import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

import { UserTokens } from '../entities/UserTokens';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({
    expiresIn,
    refreshToken,
    userId,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create({
      expires_in: expiresIn,
      refresh_token: refreshToken,
      user_id: userId,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      user_id: userId,
      refresh_token: refreshToken,
    });

    return userToken;
  }

  async deleteById(tokenId: string): Promise<void> {
    await this.repository.delete(tokenId);
  }

  async findByRefreshToken(refreshToken: string): Promise<UserTokens> {
    const userToken = await this.repository.findOne({
      refresh_token: refreshToken,
    });

    return userToken;
  }
}

export { UsersTokensRepository };
