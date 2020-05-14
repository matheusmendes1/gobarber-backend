import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '../ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    const userTwo = await fakeUsersRepository.create({
      name: 'John Wick',
      email: 'johnwick@example.com',
      password: 'mypassword',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Constantine',
      email: 'johnconstantine@example.com',
      password: 'mypassword',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([userOne, userTwo]);
  });
});
