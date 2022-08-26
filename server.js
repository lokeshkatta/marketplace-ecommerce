require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const routes = require("./routes");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 86400000 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send([
    "http://localhost:8000/api/auth/login",
    "http://localhost:8000/api/auth/register",
  ]);
});

let port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Running on ${port}!`));
