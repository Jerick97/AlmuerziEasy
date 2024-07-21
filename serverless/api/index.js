require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const meals = require("./v1/routes/meals");
const orders = require("./v1/routes/orders");
const auth = require("./v1/routes/auth");
const setupSwagger = require("./v1/swagger");

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

// Mount the /api/v1/meals router
app.use("/api/v1/meals", meals);
app.use("/api/v1/orders", orders);
app.use("/api/v1/auth", auth);

// Handle root requests by redirecting to /api/meals
app.get("/", (req, res) => {
	res.redirect("/api/v1/meals");
});

// Setup Swagger
setupSwagger(app);

app.listen(port, () => {
	console.log(`Port running at http://localhost:${port}`);
});

module.exports = app;
