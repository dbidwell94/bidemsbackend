const knex = require("../knex");
const crypt = require("bcrypt");

function addNewUser({ usename, password, email, first_name, last_name }) {
  crypt
    .hash(password, 10)
    .then((hashedString) => {
      const userObj = {
        username,
        password: hashedString,
        email,
        first_name,
        last_name,
      };
      knex.insert(userObj).into("users");
      return {
        createdUser: { username, email, first_name, last_name },
        message: "User Created",
      };
    })
    .catch((error) => {
      return { createdUser: null, message: error };
    });
}

async function logUserIn({ username, password }) {
  const user = await knex.select().from("users").where({ username });
  if (user.length < 1) {
    throw new Error("No user with that username exists");
  }
  else {
    return "hello"
  }
}

module.exports = {
  addNewUser,
  logUserIn,
};
