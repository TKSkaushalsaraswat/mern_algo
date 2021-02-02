const path = require("path");
const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect DB
connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("hello word"));

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
