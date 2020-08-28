const knex = require("../knex");
const crypt = require("bcrypt");

async function addNewUser({
  username,
  password,
  email,
  first_name,
  last_name,
}) {
  if (!username || !password || !email || !first_name || !last_name) {
    throw new Error(
      "username, password, email, first_name, and last_name is required!"
    );
  }
  else {
    const hash = crypt.hashSync(password, 10);
    const userObj = await knex.insert({username, password: hash, first_name, last_name, email}).into("users");
    return userObj
  }
}

async function logUserIn({ username, password }) {
  const userArr = await knex.select().from("users").where({ username });
  if (userArr.length < 1) {
    throw new Error("No user with that username exists");
  } else {
    user = userArr[0];
    const toReturn = await crypt
      .compare(password, user.password)
      .then((isCorrect) => {
        if(isCorrect) {
          return user
        }
        else {
          return {message: "Passwords do not match"}
        }
      })
      .catch((err) => {
        return err
      });
      return toReturn;
  }
}

module.exports = {
  addNewUser,
  logUserIn,
};
