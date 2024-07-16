const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Meals = mongoose.model(
	"Meal",
	new Schema({
		name: String,
		desc: String,
		price: Number,
		image: String,
		quantity: Number,
		category: String,
	})
);

module.exports = Meals;
