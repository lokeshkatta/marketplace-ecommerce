const express = require("express");
const router = express.Router();
const authRouter = require("./routes/auth");
const buyerRouter = require("./routes/buyer");
const sellerRouter = require("./routes/seller");

router.use("/auth", authRouter);
router.use("/buyer", buyerRouter);
router.use("/seller", sellerRouter);

router.get("/", (req, res) => {
    res.send([
      "http://localhost:8000/api/auth/login",
      "http://localhost:8000/api/auth/register",
    ]);
  });

module.exports = router;
