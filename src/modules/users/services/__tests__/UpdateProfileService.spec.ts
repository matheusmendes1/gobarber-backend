import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from '../UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakehashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakehashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakehashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Faroe',
      email: 'johnfaroe@example.com',
    });

    expect(updatedUser.name).toBe('John Faroe');
    expect(updatedUser.email).toBe('johnfaroe@example.com');
  });

  it('should not be able to change email if this email was already used', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Test',
      email: 'test@example.com',
      password: 'mypassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Faroe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing user',
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Faroe',
      email: 'johnfaroe@example.com',
      old_password: 'mypassword',
      password: 'newpassword',
    });

    expect(updatedUser.password).toBe('newpassword');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Faroe',
        email: 'johnfaroe@example.com',
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Faroe',
        email: 'johnfaroe@example.com',
        old_password: 'wrong-old-password',
        password: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
