import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let usersRepository: UsersRepositoryInMemory;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

describe('Update User Avatar', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(usersRepository);
  });

  it("Should be able to update the user's avatar", async () => {
    await usersRepository.create({
      name: 'Brian Newman',
      email: 'gapifu@labomuza.nz',
      driver_license: '18864',
      password: '123',
    });
    const user = await usersRepository.findByEmail('gapifu@labomuza.nz');

    await updateUserAvatarUseCase.execute({
      userId: user.id,
      avatarFile: 'avatar_file',
    });

    expect(user.avatar).toEqual('avatar_file');
  });

  it('Should be able to replace the avatar file', async () => {
    await usersRepository.create({
      name: 'Brian Newman',
      email: 'gapifu@labomuza.nz',
      driver_license: '18864',
      password: '123',
    });
    const user = await usersRepository.findByEmail('gapifu@labomuza.nz');

    await updateUserAvatarUseCase.execute({
      userId: user.id,
      avatarFile: 'avatar_file',
    });

    await updateUserAvatarUseCase.execute({
      userId: user.id,
      avatarFile: 'new_avatar_file',
    });

    expect(user.avatar).toEqual('new_avatar_file');
  });
});
