const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/sqlite.db");

// router.get("/", async (req, res) => {
//     db.all("SELECT * FROM Products where seller_id=1", function (error, results) {
//         res.send(results);
//       });
// });

function verifyUser(req, res, next) {
  if (req.user.type_of_user == "seller") {
    next();
  } else {
    res.redirect("/api/auth/dashboard");
  }
}

router.get("/orders", checkAuthenticated, verifyUser, (req, res) => {
  try {
    db.serialize(() => {
      db.all(
        "SELECT * FROM Orders WHERE seller_id = ?",
        [req.user.Id],
        function (err, results) {
          if (err) {
            res.send(err.message);
          }
          res.send(results);
        }
      );
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/create-catalog", checkAuthenticated, verifyUser, (req, res) => {
  try {
    db.serialize(() => {
      db.run(
        "INSERT INTO Products (name, price, catalog, seller_id, createdAt) VALUES (?,?,?,?,?)",
        [
          req.body.name,
          req.body.price,
          req.body.catalog,
          req.user.Id,
          Date("now"),
        ]
      );
      res.send("added");
    });
  } catch (e) {
    res.status(500).send();
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/api/auth/");
}

module.exports = router;
