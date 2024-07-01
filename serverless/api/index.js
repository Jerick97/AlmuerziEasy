require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const meals = require("./routes/meals");
const orders = require("./routes/orders");
const app = express();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

app.use(cors());

// Mount the /api/meals router
app.use("/api/meals", meals);
app.use("/api/orders", orders);

// Handle root requests by redirecting to /api/meals
app.get("/", (req, res) => {
	res.redirect("/api/meals");
});

app.listen(port, () => {
	console.log(`port runing in http://localhost:${port}`);
});

module.exports = app;
