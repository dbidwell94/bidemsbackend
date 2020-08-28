const express = require("express");
const router = express.Router();
const projectsModel = require("../models/projects");

/**
 * ------------------------------------
 * ALL GET REQUESTS
 * ------------------------------------
 */
router.get("/", (req, res) => {
  projectsModel
    .getAllProjects()
    .then((result) => {
      res.status(200).json({projects: result});
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

router.post("/", (req, res) => {
  const { name, description, image_url } = req.body;
  const { id: created_user_id } = req.user;
  projectsModel
    .createNewProject({ name, description, image_url, created_user_id })
    .then((result) => {
      res.status(201).json({message: "Created", project: result});
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

module.exports = router;
