const mongoose = require("mongoose");
const express = require("express");
const Orders = require("../../models/Orders");
const Meals = require("../../models/Meals");
const { isAuthenticated, hasRoles } = require("../../auth");

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

router.post("/", isAuthenticated, async (req, res) => {
	const { orders } = req.body;
	const user_id = req.user._id;

	if (!Array.isArray(orders) || orders.length === 0) {
		return res
			.status(400)
			.send({ message: "orders debe ser un array que no esté vacío" });
	}

	try {
		const session = await mongoose.startSession();
		session.startTransaction();

		const createdOrders = [];

		for (let order of orders) {
			const meals = await Meals.find({ _id: { $in: order.meal_id } }).session(
				session
			);

			for (let meal of meals) {
				if (meal.quantity <= 0) {
					await session.abortTransaction();
					session.endSession();
					return res
						.status(400)
						.send({ message: `Meal ${meal.name} está agotado` });
				}
				meal.quantity -= order.quantity;
				await meal.save({ session });
			}

			const newOrder = new Orders({ meal_ids: order.meal_id, user_id });
			const savedOrder = await newOrder.save({ session });
			createdOrders.push(savedOrder);
		}

		await session.commitTransaction();
		session.endSession();

		res.status(201).send(createdOrders); // Devuelve las órdenes creadas
	} catch (err) {
		console.error("Error creando orden:", err);
		res
			.status(500)
			.send({ message: "Error creando orden", details: err.message });
	}
});

router.put("/:id", isAuthenticated, hasRoles(["user", "admin"]), (req, res) => {
	Orders.findByIdAndUpdate(req.params.id, req.body).then(() =>
		res.sendStatus(204)
	);
});

router.delete("/:id", isAuthenticated, (req, res) => {
	Orders.findOneAndDelete(req.params.id)
		.exec()
		.then(() => res.sendStatus(204));
});

module.exports = router;
