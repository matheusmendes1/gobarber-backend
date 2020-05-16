import ListProviderAppointmentsService from '../ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointmentOne = await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointmentTwo = await fakeAppointmentsRepository.create({
      user_id: '1424214',
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([appointmentOne, appointmentTwo]);
  });
});
