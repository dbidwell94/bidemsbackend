const express = require("express");
const jwt = require("express-jwt");
const tokenauth = require("jsonwebtoken");
const authApi = require("./auth");
const projectsApi = require("./projects");
const morgan = require("morgan");
const cors = require("cors");
const { token } = require("morgan");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());

// JWT Credentials
app.use(
  jwt({
    credentialsRequired: true,
    secret: process.env.SECRET,
    requestProperty: "user",
    algorithms: ["HS256"],
  }).unless({ path: ["/api/auth/register", "/api/auth/login"] })
);

app.use((req, res, next) => {
  if (req.user) {
    const { username, id, email, first_name, last_name } = req.user;
    if (!username || !id || !email || !first_name || !last_name) {
      res.status(401).json({ message: "Token not valid. Please log in again" });
      return;
    }
  }
  next();
});

app.use(express.json());

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next();
});

app.use("/api/auth", authApi);
app.use("/api/projects", projectsApi);

app.get("/", (req, res) => {
  res.json({ message: "Server running" });
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
