const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/sqlite.db");

router.get("/", async (req, res) => {
  db.all("SELECT * FROM Orders", function (error, results) {
    res.send(results);
  });
});

function verifyUser(req, res, next) {
  if (req.user.type_of_user == "buyer") {
    next();
  } else {
    res.redirect("/api/auth/dashboard");
  }
}

router.get(
  "/list-of-sellers",
  checkAuthenticated,
  verifyUser,
  async (req, res) => {
    try {
      db.all(
        "SELECT Id,username from Users where type_of_user=(?)","seller",
        function (error, results) {
          res.send(results);
        }
      );
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.get(
  "/seller-catalog/:seller_id",
  checkAuthenticated,
  verifyUser,
  (req, res) => {
    try {
      db.serialize(() => {
        db.all(
          "SELECT DISTINCT catalog FROM Products where seller_id=?",
          [req.params.seller_id],
          function (error, results) {
            if (error) {
              res.send(error.message);
            } else {
              res.send(results);
            }
          }
        );
      });
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.get(
  "/seller-catalog/:seller_id/:catalog",
  checkAuthenticated,
  verifyUser,
  (req, res) => {
    try {
      db.serialize(() => {
        db.all(
          "SELECT * FROM Products WHERE seller_id = (?) and catalog = (?)",
          [req.params.seller_id, req.params.catalog],
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
  }
);

router.post(
  "/create-order/:seller_id",
  checkAuthenticated,
  verifyUser,
  (req, res) => {
    try {
      const orders = req.body.orders;
      db.serialize(() => {
        for (let i = 0; i < orders.length; i++) {
          db.run(
            "INSERT INTO Orders (buyer_id,name, price, catalog, quantity,seller_id, createdAt) VALUES (?,?,?,?,?,?,?)",
            [
              req.user.Id,
              orders[i][0],
              orders[i][1],
              orders[i][2],
              orders[i][3],
              req.params.seller_id,
              Date("now"),
            ]
          );
        }
        res.send("ordered");
      });
    } catch (e) {
      res.status(500).send();
    }
  }
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/api/auth/");
}

module.exports = router;
