/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const md5 = require("md5");

exports.seed = async function (knex) {
  //create admin user
  await knex("syst_users").del();
  const pwd = await md5(process.env.ADMIN_PWD);
  await knex("syst_users").insert([
    { username: "admin@moenco.com.et", password: pwd, role: "admin" },
  ]);
};
