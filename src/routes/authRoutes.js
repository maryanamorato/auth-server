const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

// oks these are generic auth funcs :)

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "MYSECRETKEY");
    res.status(200).send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/auth/criar-usuario", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(422)
      .send({ error: "Must provide name, email and password ;)" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email :(" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MYSECRETKEY");
    res.status(201).send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email :(" });
  }
});

module.exports = router;
