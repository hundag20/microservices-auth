const { Model } = require("objection");
const Knex = require("knex");
const dotenv = require("dotenv");
const logger = require("./controllers/logger");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const conn_string = {
  server: process.env.DB_SERVER,
  // port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  requestTimeout: 300000,
};
logger("info", `server: ${conn_string.server}`);
logger("info", `user: ${conn_string.user}`);
logger("info", `db: ${conn_string.database}`);
logger("info", `pwd: ${conn_string.password}`);
// Initialize knex.
const knex = Knex({
  client: "mssql",
  connection: conn_string,
});

// Give the knex instance to objection.
const a = Model.knex(knex);
module.exports = Model;
