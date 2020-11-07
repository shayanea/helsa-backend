module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: env('DATABASE_HOST', 'helsa-development.owc0j.mongodb.net'),
        srv: env.bool('DATABASE_SRV', true),
        port: env.int('DATABASE_PORT', 27017),
        database: env('DATABASE_NAME', 'helsa-development'),
        username: env('DATABASE_USERNAME', 'shayanea'),
        password: env('DATABASE_PASSWORD', 'abba77926355'),
      },
      options: {
        authenticationDatabase: env('AUTHENTICATION_DATABASE', 'admin'),
        ssl: env.bool('DATABASE_SSL', true),
      },
    },
  },
});
