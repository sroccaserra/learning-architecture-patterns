const knexConfig = {
  test: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'example',
      database: 'postgres'
    }
  },

  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'example',
      database: 'postgres'
    }
  },
};

export default knexConfig;
