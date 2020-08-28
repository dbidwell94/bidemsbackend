exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          username: "testuser1",
          first_name: "Test",
          last_name: "User",
          email: "test@user.com",
          password: "testing1234",
        },
        {
          id: 2,
          username: "testuser2",
          first_name: "Test",
          last_name: "User",
          email: "test@user.com",
          password: "testing1234",
        },
        {
          id: 3,
          username: "testuser3",
          first_name: "Test",
          last_name: "User",
          email: "test@user.com",
          password: "testing1234",
        },
      ]);
    });
};
