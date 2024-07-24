const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Orders = mongoose.model(
	"Order",
	new Schema({
		meal_ids: {
			type: [Schema.Types.ObjectId],
			ref: "Meal",
			validate: {
				validator: function (v) {
					return Array.isArray(v) && v.length > 0;
				},
				message: "Meal_ids must be an array that is not empty",
			},
		},
		user_id: { type: Schema.Types.ObjectId, ref: "User" },
		created_at: {
			type: Date,
			default: Date.now,
		},
	})
);

module.exports = Orders;
