import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import CreateUserService from '../CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, hashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'apassword',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, hashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'apassword',
    });

    await expect(
      createUser.execute({
        name: 'John Lenny',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
