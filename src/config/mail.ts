interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'matheusmendes006@gmail.com',
      name: 'Matheus - GoBarber',
    },
  },
} as IMailConfig;
