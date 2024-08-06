const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = mongoose.model(
	"User",
	new Schema({
		name: { type: String, required: true, minLength: 3 },
		email: String,
		password: String,
		salt: String,
		role: { type: String, default: "user" }, //admin
	})
);

module.exports = Users;
