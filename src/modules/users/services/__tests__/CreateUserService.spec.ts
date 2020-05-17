import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import CreateUserService from '../CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    hashProvider = new FakeHashProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      hashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'apassword',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another user', async () => {
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
