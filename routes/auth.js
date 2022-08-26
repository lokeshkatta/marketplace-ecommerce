const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = new sqlite3.Database("./database/sqlite.db");
const passport = require("passport");

const initializePassport = require("../passport-config");
initializePassport(
  passport,
  (username) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(
          "SELECT * FROM Users WHERE username = ?",
          [username],
          function (err, rows) {
            if (err) reject(err);
            resolve(rows);
          }
        );
      });
    });
  },
  (id) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get("SELECT * FROM Users WHERE Id = ?", [id], function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        });
      });
    });
  }
);
router.get("/", async (req, res) => {
  res.send([
    "http://localhost:8000/api/auth/login",
    "http://localhost:8000/api/auth/register",
  ]);
});

router.get("/dashboard", checkAuthenticated, async (req, res) => {
  if (req.user.type_of_user == "seller") {
    res.send([
      "http://localhost:8000/api/seller/create-catalog",
      "http://localhost:8000/api/seller/orders",
      "http://localhost:8000/api/auth/logout",
    ]);
  } else {
    res.send([
      "http://localhost:8000/api/buyer/list-of-sellers",
      "http://localhost:8000/api/buyer/seller-catalog/:seller_id",
      "http://localhost:8000/api/buyer/seller-catalog/:seller_id/:catalog",
      "http://localhost:8000/api/buyer/create-order/:seller_id",
      "http://localhost:8000/api/auth/logout",
    ]);
  }
});

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.send(["http://localhost:8000/api/auth/login"]);
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    db.run(
      "INSERT INTO Users (username, password, type_of_user) VALUES (?,?,?)",
      [req.body.username, hashedPassword, req.body.type_of_user]
    );
    res.redirect("/");
  } catch (e) {
    res.redirect("/");
  }
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.send([
    "http://localhost:8000/api/auth/login",
    "http://localhost:8000/api/auth/register",
  ]);
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "dashboard",
    failureRedirect: "login",
    failureFlash: true,
  })
);

router.get("/logout", function (req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("dashboard");
  }
  next();
}

module.exports = router;
