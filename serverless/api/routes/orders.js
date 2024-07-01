const express = require("express");
const Orders = require("../models/Orders");

const router = express.Router();

router.get("/", (req, res) => {
	// Devuelve todos las ordenes
	Orders.find()
		.exec()
		.then((order) => res.status(200).send(order));
});

router.get("/:id", (req, res) => {
	Orders.findById(req.params.id)
		.exec()
		.then((order) => res.status(200).send(order));
});

router.post("/", (req, res) => {
	Orders.create(req.body).then((order) => res.status(201).send(order));
});

router.put("/:id", (req, res) => {
	Orders.findByIdAndUpdate(req.params.id, req.body).then(() =>
		res.sendStatus(204)
	);
});

router.delete("/:id", (req, res) => {
	Orders.findOneAndDelete(req.params.id)
		.exec()
		.then(() => res.sendStatus(204));
});

module.exports = router;
