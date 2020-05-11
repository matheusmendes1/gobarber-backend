import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from '../UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      storageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar without a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      storageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: 'no_id',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const storageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      storageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'mypassword',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');

    expect(user.avatar).toBe('avatar2.png');
  });
});
