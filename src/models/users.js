const knex = require("../knex");

async function getUserById(id) {
  const user = await knex
    .select([
      "username",
      "email",
      "id",
      "first_name",
      "last_name",
      "created_at",
    ])
    .from("users")
    .where({ id })
    .first();
  if (!user) {
    throw new Error("That user does not exist");
  } else return user;
}

async function deleteUserById(id) {
  const testUser = await knex.select("*").from("users").where({ id }).first();
  if (!testUser) {
    throw new Error("That user does not exist");
  } else {
    await knex.select("*").from("users").where({ id }).del();
    return "User deleted";
  }
}

async function getUserByUsername(usrname) {
    
}


module.exports = {
    getUserById,
    deleteUserById
}