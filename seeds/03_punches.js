exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("punches")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("punches").insert([
        { id: 1, user_id: 1, project_id: 1, is_punch_in: true },
        { id: 2, user_id: 2, project_id: 1, is_punch_in: true },
        { id: 3, user_id: 3, project_id: 1, is_punch_in: true },
      ]);
    });
};
