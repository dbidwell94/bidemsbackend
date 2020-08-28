const express = require("express");
const crypt = require("bcrypt");
const tokenHandler = require("jsonwebtoken");
const { json } = require("express");
const router = express.Router();
const authModel = require("../models/index");

router.post("/register", (req, res) => {
  const { username, password, first_name, last_name, email } = req.body;
  if (!username || !password || !first_name || !last_name || !email) {
    res.status(400).json({
      message:
        "A username, email, first_name, last_name, and password are required",
    });
  } else {
    const token = tokenHandler.sign({ username, email }, process.env.SECRET, {
      expiresIn: "1 day",
    });
    res
      .status(201)
      .json({ userObj: { username, first_name, last_name, email, token } });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).json({ message: "Please include username and password" });
  } else {
    const t = authModel.logUserIn({username, password}).then(result => {
      res.status(200).json(result);
    }).catch(err => {
      res.status(404).json({message: err.message})
    })
  }
});

module.exports = router;
