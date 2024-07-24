const mongoose = require("mongoose");
const express = require("express");
const Orders = require("../../models/Orders");
const Meals = require("../../models/Meals");
const { isAuthenticated, hasRoles } = require("../../auth");

const router = express.Router();

router.get("/", (req, res) => {
	// Devuelve todas las órdenes
	Orders.find()
		.exec()
		.then((orders) => res.status(200).json(orders))
		.catch((error) => {
			// Manejo de errores
			res
				.status(500)
				.json({ message: "Error retrieving orders", error: error });
		});
});

router.get("/:id", (req, res) => {
	Orders.findById(req.params.id)
		.exec()
		.then((order) => {
			if (!order) {
				// Si no se encuentra la orden con el ID proporcionado
				return res.status(404).json({ message: "Order not found" });
			}
			// Si se encuentra la orden, devolverla con estado 200
			res.status(200).json(order);
		})
		.catch((error) => {
			// Manejo de errores
			res.status(500).json({ message: "Error retrieving order", error: error });
		});
});

router.post("/", isAuthenticated, async (req, res) => {
	const { orders } = req.body;
	const user_id = req.user._id;

	if (!Array.isArray(orders) || orders.length === 0) {
		return res
			.status(400)
			.send({ message: "Orders must be an array that is not empty" });
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
						.send({ message: `Meal ${meal.name} Is it sold out` });
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
		console.error("Error creating order:", err);
		res
			.status(500)
			.send({ message: "Error creating order", details: err.message });
	}
});

router.put(
	"/:id",
	isAuthenticated,
	hasRoles(["user", "admin"]),
	async (req, res) => {
		try {
			// Actualiza la orden por ID
			const updatedOrder = await Orders.findByIdAndUpdate(
				req.params.id,
				req.body,
				{ new: true }
			).exec();

			if (!updatedOrder) {
				// Si no se encuentra la orden con el ID proporcionado
				return res.status(404).json({ message: "Order not found" });
			}

			// Si la orden se actualiza con éxito
			res.status(200).json(updatedOrder);
		} catch (error) {
			// Manejo de errores
			console.error("Error updating order:", error);
			res.status(500).json({ message: "Error updating order", error: error });
		}
	}
);

router.delete("/:id", isAuthenticated, async (req, res) => {
	try {
		// Busca y elimina la orden por ID
		const deletedOrder = await Orders.findByIdAndDelete(req.params.id).exec();

		if (!deletedOrder) {
			// Si no se encuentra la orden con el ID proporcionado
			return res.status(404).json({ message: "Order not found" });
		}

		// Si la orden se elimina con éxito
		res.sendStatus(204);
	} catch (error) {
		// Manejo de errores
		console.error("Error deleting order:", error);
		res.status(500).json({ message: "Error deleting order", error: error });
	}
});

module.exports = router;
