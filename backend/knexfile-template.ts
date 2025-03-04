import type { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: '0.0.0.0',
    user: 'user',
    password: 'password',
    database: 'database'
  }
};

export default config;
