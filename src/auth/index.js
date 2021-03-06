const express = require("express");
const tokenHandler = require("jsonwebtoken");
const router = express.Router();
const authModel = require("../models/auth");

/**
 * ---------------------------------------------
 * ALL POST REQUESTS
 * ---------------------------------------------
 */

router.post("/register", (req, res) => {
  const { username, password, first_name, last_name, email } = req.body;
  if (!username || !password || !first_name || !last_name || !email) {
    res.status(400).json({
      message:
        "A username, email, first_name, last_name, and password are required",
    });
  } else {
    authModel
      .addNewUser({ username, password, first_name, last_name, email })
      .then((result) => {
        const { password, created_at, updated_at, ...toReturn } = result;
        const token = tokenHandler.sign(toReturn, process.env.SECRET, {
          expiresIn: "1 day",
        });
        res.status(201).json({ user: toReturn, token });
      })
      .catch((error) => {
        res.status(401).json({ message: error.message });
      });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).json({ message: "Please include username and password" });
  } else {
    const t = authModel
      .logUserIn({ username, password })
      .then((result) => {
        if (result === null || result === undefined) {
          res.status(401).json({ message: "An error has occured" });
          return;
        } else {
          const { password, created_at, updated_at, ...toReturn } = result;
          const token = tokenHandler.sign(toReturn, process.env.SECRET, {
            expiresIn: "1 day",
          });
          res.status(200).json({ user: toReturn, token });
        }
      })
      .catch((err) => {
        res.status(404).json({ message: err.message });
      });
  }
});

/**
 * ---------------------------------------------
 * ALL DELETE REQUESTS
 * ---------------------------------------------
 */

module.exports = router;
