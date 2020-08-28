const express = require("express");
const jwt = require("express-jwt");
const authApi = require("./auth");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(
  jwt({
    credentialsRequired: true,
    secret: process.env.SECRET,
    requestProperty: "user",
    algorithms: ["HS256"],
  }).unless({ path: ["/api/auth/register", "/api/auth/login"] })
);

app.use(express.json());

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next();
});

app.use("/api/auth", authApi);

app.get("/", (req, res) => {
  res.json({ message: "Server running" });
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
