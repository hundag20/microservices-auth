const { Model } = require("objection");
const Knex = require("knex");

const conn_string = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  requestTimeout: 300000,
};
// Initialize knex.
const knex = Knex({
  client: "mssql",
  connection: conn_string,
});

// Give the knex instance to objection.
const a = Model.knex(knex);
module.exports = Model;
