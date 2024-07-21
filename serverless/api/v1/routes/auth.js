const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Users = require("../../models/Users");
const { isAuthenticated } = require("../../auth");

const router = express.Router();

const signToken = (userId) => {
	return jwt.sign({ _id: userId }, "mi-secreto", {
		expiresIn: 60 * 60 * 24 * 365, // 1 año
	});
};

router.post("/register", (req, res) => {
	const { email, password } = req.body;
	crypto.randomBytes(16, (err, salt) => {
		if (err) {
			return res.status(500).json({ message: "Internal Server Error" });
		}
		const newSalt = salt.toString("base64");
		crypto.pbkdf2(password, newSalt, 10000, 64, "sha1", (err, key) => {
			if (err) {
				return res.status(500).json({ message: "Internal Server Error" });
			}
			const encryptedPassword = key.toString("base64");
			Users.findOne({ email })
				.exec()
				.then((user) => {
					if (user) {
						return res.status(400).json({ message: "User already exists" });
					}
					Users.create({
						email,
						password: encryptedPassword,
						salt: newSalt,
					})
						.then(() => {
							res.status(201).json({ message: "User created successfully!" });
						})
						.catch((err) => {
							res.status(500).json({ message: "Internal Server Error" });
						});
				});
		});
	});
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;
	Users.findOne({ email })
		.exec()
		.then((user) => {
			if (!user) {
				return res.status(401).json({ message: "Invalid email or password" });
			}
			crypto.pbkdf2(password, user.salt, 10000, 64, "sha1", (err, key) => {
				const encryptedPassword = key.toString("base64");
				if (user.password === encryptedPassword) {
					const token = signToken(user._id);
					return res.status(200).json({ token: token });
				}
				return res.status(401).json({ message: "Invalid email or password" });
			});
		})
		.catch((error) => {
			res.status(500).send({ message: "Internal Server Error" });
		});
});

router.get("/me", isAuthenticated, (req, res) => {
	try {
		const { password, salt, ...userWithoutSensitiveInfo } = req.user._doc;
		res.status(200).json(userWithoutSensitiveInfo);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// Ruta para obtener todos los usuarios
router.get("/users", isAuthenticated, (req, res) => {
	Users.find()
		.then((users) => {
			const usersWithoutSensitiveInfo = users.map((user) => {
				const { password, salt, ...userWithoutSensitiveInfo } = user._doc;
				return userWithoutSensitiveInfo;
			});
			res.status(200).send(usersWithoutSensitiveInfo);
		})
		.catch((error) => {
			res.status(500).send({ message: "Error retrieving users" });
		});
});

// Ruta para eliminar un usuario por ID
router.delete("/users/:id", isAuthenticated, (req, res) => {
	const userId = req.params.id;
	Users.findByIdAndDelete(userId)
		.then((deletedUser) => {
			if (!deletedUser) {
				return res.status(404).send({ message: "User not found" });
			}
			res.status(200).send({ message: "User successfully deleted" });
		})
		.catch((error) => {
			res.status(500).send({ message: "Error deleting user", error });
		});
});

module.exports = router;
