const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Users = require("../models/Users");
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const readFileAsync = promisify(fs.readFile);

export const requestPasswordReset = async (req, res, next) => {
	const { email } = req.body;

	try {
		const user = await Users.findOne({ email });
		if (!user) return res.status(404).json({ message: "User doesn't exist" });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "2h",
		});

		const resetURL = `https://almuerzieasy.vercel.app/?resetpassword&id=${user._id}&token=${token}`;

		// Read the HTML template and image file
		const htmlTemplatePath = path.join(
			__dirname,
			"../template/forgot-password.html"
		);
		const imageAttachmentPath = path.join(__dirname, "../template/logo.png");

		const htmlTemplate = await readFileAsync(htmlTemplatePath, "utf-8");
		const imageAttachment = await readFileAsync(imageAttachmentPath);

		// Replace all placeholders in the HTML template
		const personalizedHtmlTemplate = htmlTemplate
			.replace(/\[Recipient\]/g, user.name)
			.replace(/\[resetUrl\]/g, resetURL);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD_EMAIL,
			},
		});

		const mailOptions = {
			to: user.email,
			from: process.env.EMAIL,
			subject: "Confirm forgot password for your AlmuerziEasy account",
			html: personalizedHtmlTemplate,
			attachments: [
				{
					filename: "logo.png",
					content: imageAttachment,
					encoding: "base64",
					cid: "uniqueImageCID", // Referenced in the HTML template
				},
			],
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "Password reset link sent" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const resetPassword = async (req, res, next) => {
	const { id, token } = req.params;
	const { password } = req.body;

	try {
		const user = await Users.findOne({ _id: id });
		if (!user) {
			return res.status(400).json({ message: "User does not exist" });
		}

		// Verificar el token
		jwt.verify(token, process.env.JWT_SECRET);

		// Generar un nuevo salt y cifrar la contraseña
		crypto.randomBytes(16, (err, salt) => {
			if (err) {
				return res.status(500).json({ message: "Internal Server Error" });
			}
			const newSalt = salt.toString("base64");
			crypto.pbkdf2(password, newSalt, 10000, 64, "sha1", async (err, key) => {
				if (err) {
					return res.status(500).json({ message: "Internal Server Error" });
				}
				const encryptedPassword = key.toString("base64");

				// Actualizar la contraseña y el salt en la base de datos
				await Users.updateOne(
					{ _id: id },
					{
						$set: {
							password: encryptedPassword,
							salt: newSalt,
						},
					}
				);

				res
					.status(200)
					.json({ message: "Password has been reset successfully" });
			});
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Something went wrong" });
	}
};
