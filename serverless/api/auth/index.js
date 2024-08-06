const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

//Middleware

const isAuthenticated = (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).send("No token provided");
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		const { _id } = decoded;
		Users.findOne({ _id })
			.exec()
			.then((user) => {
				req.user = user;
				next();
			});
	});
};

const hasRoles = (roles) => (req, res, next) => {
	if (roles.indexOf(req.user.role) > -1) {
		return next();
	}
	res.sendStatus(403);
};

module.exports = {
	isAuthenticated,
	hasRoles,
};
