const express = require("express");
const router = express.Router();
const projectsModel = require("../models/projects");

function sendResponse(message, payload) {
  return { message: message, payload };
}

/**
 * ------------------------------------
 * ALL GET REQUESTS
 * ------------------------------------
 */
router.get("/", (req, res) => {
  projectsModel
    .getAllProjects()
    .then((result) => {
      res.status(200).json({ projects: result });
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  projectsModel
    .getProjectById(id)
    .then((result) => {
      res.status(200).json(sendResponse("Request successful", result));
    })
    .catch((err) => {
      res.status(400).json(sendResponse(err.message));
    });
});

router.get("/permissions", (req, res) => {
  res.status(200).json({
    message:
      "When adding a user to a project, they can only be these permissions:",
    permissions: projectsModel.userAccessEnums,
  });
});

/**
 * ------------------------------------
 * ALL POST REQUESTS
 * ------------------------------------
 */

router.post("/", (req, res) => {
  const { name, description, image_url } = req.body;
  const { id: created_user_id } = req.user;
  projectsModel
    .createNewProject({ name, description, image_url, created_user_id })
    .then((result) => {
      res.status(201).json({ message: "Created", project: result });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

router.post("/:id/adduser", (req, res) => {
  const { id: projectId } = req.params;
  const { id: creatorId } = req.user;
  const { id: idToAdd, permission } = req.body;
  if (!idToAdd || !permission) {
    res
      .status(400)
      .json(
        sendResponse(
          "Please include a id and a permission in your request. Permissions are attached",
          projectsModel.userAccessEnums
        )
      );
    return;
  }
  if (!projectsModel.userAccessEnums.includes(permission)) {
    res
      .status(400)
      .json(
        sendResponse(
          `${permission} is not a valid permission. Permissions are attached`,
          projectsModel.userAccessEnums
        )
      );
    return;
  }
  projectsModel
    .addUserToProject({ creatorId, projectId, idToAdd, permission })
    .then((result) => {
      res.status(201).json(sendResponse("Success", result));
    })
    .catch((err) => {
      res.status(400).json(sendResponse(err.message));
    });
});

module.exports = router;
