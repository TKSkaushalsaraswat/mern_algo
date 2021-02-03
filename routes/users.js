const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
  hmacSHA1,
  sha1,
  md5,
  AES,
  hmacSHA512,
  hmacSHA256,
} = require("../utils/security");

// @route  POST api/users
// @desc  Register a users
// @access Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    console.log("hmacSHA1: " + hmacSHA1("secret", password));
    console.log("hmacSHA512: " + hmacSHA512("secret", password));
    console.log("hmacSHA256: " + hmacSHA256("secret", password));
    console.log("sha1: " + sha1(password));
    console.log("md5: " + md5(password));

    const encrypt = AES(password, "secret");

    console.log("encrypt: " + encrypt);

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User aleredy exists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
