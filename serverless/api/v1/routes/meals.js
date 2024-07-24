const express = require("express");
const Meals = require("../../models/Meals");

const router = express.Router();

router.get("/", (req, res) => {
	// Devuelve todos los platos
	Meals.find()
		.exec()
		.then((meal) => res.status(200).send(meal))
		.catch((error) => {
			res.status(500).send({ message: "Internal Server Error" });
		});
});

router.get("/:id", (req, res) => {
	Meals.findById(req.params.id)
		.exec()
		.then((meal) => {
			if (!meal) {
				// Si no se encuentra el plato con el ID proporcionado
				return res.status(404).json({ message: "Meal not found" });
			}
			// Si se encuentra el plato
			res.status(200).json(meal);
		})
		.catch((error) => {
			// Manejo de errores
			res.status(500).json({ message: "Error getting Meal", error });
		});
});

router.post("/", (req, res) => {
	Meals.create(req.body)
		.then((meal) => res.status(201).send(meal))
		.catch((error) => {
			// Manejo de errores si ocurre un problema al crear el plato
			if (error.name === "ValidationError") {
				// Si el error es de validación, respondemos con un estado 400
				res.status(400).json({ message: "Invalid input data", error });
			} else {
				// Para otros errores, respondemos con un estado 500
				res.status(500).json({ message: "Error creating Meal", error });
			}
		});
});

router.put("/:id", (req, res) => {
	Meals.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})
		.then((updatedMeal) => {
			if (!updatedMeal) {
				// Si no se encuentra el plato con el ID proporcionado
				return res.status(404).json({ message: "Meal not found" });
			}
			// Si la actualización es exitosa
			res.status(200).json(updatedMeal);
		})
		.catch((error) => {
			// Manejo de errores
			if (error.name === "ValidationError") {
				// Si el error es de validación, respondemos con un estado 400
				res.status(400).json({ message: "Invalid input data", error });
			} else {
				// Para otros errores, respondemos con un estado 500
				res.status(500).json({ message: "Error updating Meal", error });
			}
		});
});

router.delete("/:id", (req, res) => {
	Meals.findByIdAndDelete(req.params.id)
		.exec()
		.then((deletedMeal) => {
			if (!deletedMeal) {
				// Si no se encuentra el plato con el ID proporcionado
				return res.status(404).json({ message: "Meal not found" });
			}
			// Si la eliminación es exitosa
			res.sendStatus(204);
		})
		.catch((error) => {
			// Manejo de errores
			res.status(500).json({ message: "Error deleting Meal", error });
		});
});

module.exports = router;
