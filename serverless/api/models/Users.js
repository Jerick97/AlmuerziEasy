const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = mongoose.model(
	"User",
	new Schema({
		name: { type: String, required: true, minLength: 3 },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		salt: String,
		role: { type: String, default: "user" }, //admin
	})
);

module.exports = Users;
