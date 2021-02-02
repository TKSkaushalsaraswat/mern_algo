const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Product = require("../models/Product");

router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({
      date: -1,
    });

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, category } = req.body;

    try {
      const newProduct = new Product({
        name,
        price,
        category,
        user: req.user.id,
      });

      const products = await newProduct.save();

      res.json(products);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put("/:id", auth, async (req, res) => {
  const { name, id, price, category } = req.body;

  //Build product object
  const productField = {};

  if (name) productField.name = name;
  if (id) productField.id = id;
  if (price) productField.price = price;
  if (category) productField.category = category;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    //Make sure user owns product
    if (product.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Not Authorized" });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productField },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    consol.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/contacts/:id
// @desc   Delete contacts
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: "Contact not found" });

    //Make sure user owns product
    if (product.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Not Authorized" });
    }

    await Product.findByIdAndRemove(req.params.id);

    res.json({ msg: "Product Removed" });
  } catch (err) {
    consol.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
