import { AppError } from '@shared/errors/AppError';

import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';

import { SendPasswordRecoveryMailUseCase } from './SendPasswordRecoveryMailUseCase';

let sendPasswordRecoveryMailUseCase: SendPasswordRecoveryMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe('SendPasswordRecoveryMail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendPasswordRecoveryMailUseCase = new SendPasswordRecoveryMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('Should be able to send a password recovery mail to the user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      name: 'Iva Castillo',
      email: 'pem@vuzenguw.lv',
      driver_license: '296259',
      password: '123',
    });

    await sendPasswordRecoveryMailUseCase.execute('pem@vuzenguw.lv');

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to send a mail if the user does not exist', async () => {
    await expect(
      sendPasswordRecoveryMailUseCase.execute('dus@daid.gs'),
    ).rejects.toEqual(new AppError('User not found!'));
  });

  it("Should be able create the user's token", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      'create',
    );

    await usersRepositoryInMemory.create({
      name: 'Melvin Morgan',
      email: 'se@izuafa.gs',
      driver_license: '709540',
      password: '1234',
    });

    await sendPasswordRecoveryMailUseCase.execute('se@izuafa.gs');

    expect(generateTokenMail).toBeCalled();
  });
});
