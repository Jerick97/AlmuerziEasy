const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { isAuthenticated } = require("../auth");

const router = express.Router();

const signToken = (userId) => {
	return jwt.sign({ _id: userId }, "mi-secreto", {
		expiresIn: 60 * 60 * 24 * 365, // 1 año
	});
};

router.post("/register", (req, res) => {
	const { email, password } = req.body;
	crypto.randomBytes(16, (err, salt) => {
		const newSalt = salt.toString("base64");
		crypto.pbkdf2(password, newSalt, 10000, 64, "sha1", (err, key) => {
			const encryptedPassword = key.toString("base64");
			Users.findOne({ email })
				.exec()
				.then((user) => {
					if (user) {
						return res.json({ message: "usuario ya existe" });
					}
					Users.create({
						email,
						password: encryptedPassword,
						salt: newSalt,
					}).then(() => {
						res.status(201).json({ message: "usuario creado con éxito" });
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
				return res
					.status(401)
					.json({ message: "usuario y/o contraseña incorrecta" });
			}
			crypto.pbkdf2(password, user.salt, 10000, 64, "sha1", (err, key) => {
				const encryptedPassword = key.toString("base64");
				if (user.password === encryptedPassword) {
					const token = signToken(user._id);
					return res.status(200).json({ token: token });
				}
				return res
					.status(401)
					.json({ message: "usuario y/o contraseña incorrecta" });
			});
		});
});

router.get("/me", isAuthenticated, (req, res) => {
	const { password, salt, ...userWithoutSensitiveInfo } = req.user._doc;
	res.send(userWithoutSensitiveInfo);
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
			res.status(500).send({ message: "Error al obtener los usuarios" });
		});
});

// Ruta para eliminar un usuario por ID
router.delete("/users/:id", isAuthenticated, (req, res) => {
	const userId = req.params.id;
	Users.findByIdAndDelete(userId)
		.then((deletedUser) => {
			if (!deletedUser) {
				return res.status(404).send({ message: "Usuario no encontrado" });
			}
			res.status(200).send({ message: "Usuario eliminado con éxito" });
		})
		.catch((error) => {
			res.status(500).send({ message: "Error al eliminar el usuario", error });
		});
});

module.exports = router;
