import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

interface IUsersRepository {
  create(userData: ICreateUserDTO): Promise<void>;
}

export { IUsersRepository };
