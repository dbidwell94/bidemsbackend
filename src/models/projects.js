const knex = require("../knex");

const projectWithUsernameSelector = [
  "projects.id",
  "projects.due_date",
  "projects.name",
  "projects.description",
  "projects.image_url",
  "projects.completed",
  "projects.created_at",
  "users.username as created_username",
];

/**
 * --------------------------------
 * ALL GET REQUESTS
 * --------------------------------
 */

/**
 * @returns a promise with either an error or an array of projects
 */
async function getAllProjects() {
  const projects = await knex
    .select(projectWithUsernameSelector)
    .from("projects")
    .innerJoin("users", "projects.created_user_id", "=", "users.id");
  if (projects.length < 1) {
    throw new Error("No projects yet");
  } else {
    return projects;
  }
}

async function getProjectById(id) {
  const projects = await knex
    .select(projectWithUsernameSelector)
    .from("projects")
    .where({ id });
  if (projects.length < 1) {
    throw new Error("No project with that id");
  } else return projects[0];
}

/**
 * -------------------------------
 * ALL POST REQUESTS
 * -------------------------------
 */

/**
 *
 */

async function createNewProject({
  name,
  description,
  image_url,
  created_user_id,
}) {
  if (!name || !description || !created_user_id) {
    throw new Error("Name and description are required!");
  } else {
    await knex
      .insert({ name, description, image_url, created_user_id })
      .into("projects");
    const toReturn = await knex
      .select(projectWithUsernameSelector)
      .from("projects")
      .orderBy("id", "desc")
      .limit(1)
      .innerJoin("users", "users.id", "=", "projects.created_user_id");
    return toReturn[0];
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createNewProject,
};
