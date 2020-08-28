const knex = require("../knex");

const userAccessEnums = ["User", "Admin", "Moderator"];

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
  console.log(id);
  const project = await knex
    .select(projectWithUsernameSelector)
    .from("projects")
    .where({ "projects.id": id })
    .innerJoin("users", "users.id", "=", "projects.created_user_id")
    .first();
  if (!project) {
    throw new Error("That project does not exist");
  } else {
    return project;
  }
}

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

async function addUserToProject({ projectId, creatorId, idToAdd, permission }) {
  const project = await knex
    .select("*")
    .from("projects")
    .where({ "projects.id": projectId })
    .first();

  const user = await knex
    .select("*")
    .from("users")
    .where({ id: idToAdd })
    .first();

  if (!project) {
    throw new Error("That project was not found");
  } else if (!user) {
    throw new Error("That user does not exist");
  } else {
    if (project.created_user_id !== creatorId) {
      throw new Error("Only the project creator can add new users");
    } else {
      await knex
        .insert({
          access_level: permission,
          project_id: projectId,
          user_id: idToAdd,
        })
        .into("projects_to_users");
    }
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createNewProject,
  addUserToProject,
  userAccessEnums,
};
