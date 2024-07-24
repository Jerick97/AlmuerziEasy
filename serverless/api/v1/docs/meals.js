const getAllMeals = {
	tags: ["Meals"],
	description: "Get all meals in the system",
	operationId: "getAllMeals",
	responses: {
		200: {
			description: "A list of meals",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: {
							$ref: "#/components/schemas/Meal",
						},
					},
					examples: {
						ClassicCheeseburger: {
							summary: "hamburger",
							value: [
								{
									_id: "668dcf72ae2d25306ed0d1dd",
									name: "Classic Cheeseburger",
									desc: "Hamburguesa clásica con queso cheddar, lechuga, tomate y cebolla. Servida en un pan brioche tostado.",
									price: 8.99,
									image:
										"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565766/AlmuerziEasy/Hamburguesa/v1e1baliyxizcnttdyke.png",
									quantity: 10,
									category: "hamburger",
								},
								{
									_id: "668dcf72ae2d25306ed0d1de",
									name: "Bacon BBQ Burger",
									desc: "Jugosa hamburguesa con queso cheddar, tocino crujiente y salsa BBQ ahumada. Acompañada de aros de cebolla.",
									price: 10.99,
									image:
										"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565767/AlmuerziEasy/Hamburguesa/kmi8rnqfrwqkjyeyzywn.png",
									quantity: 10,
									category: "hamburger",
								},
								{
									_id: "668dcf72ae2d25306ed0d1df",
									name: "Mushroom Swiss Burger",
									desc: "Hamburguesa cubierta con champiñones salteados y queso suizo derretido. Servida en un pan de centeno.",
									price: 9.99,
									image:
										"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565766/AlmuerziEasy/Hamburguesa/chyo7hpits8gl6efg1fc.png",
									quantity: 10,
									category: "hamburger",
								},
								{
									_id: "668dcf72ae2d25306ed0d1dg",
									name: "Spicy Jalapeño Burger",
									desc: "Picante hamburguesa con jalapeños frescos, queso pepper jack y salsa chipotle. Acompañada de lechuga y tomate.",
									price: 9.49,
									image:
										"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565766/AlmuerziEasy/Hamburguesa/i9vx2qw6xowpvniz9why.png",
									quantity: 10,
									category: "hamburger",
								},
							],
						},
					},
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Internal Server Error",
							},
						},
					},
				},
			},
		},
	},
};

const Meal = {
	type: "object",
	properties: {
		_id: {
			type: "string",
			description: "The unique identifier for the meal.",
			example: "60d5f60f8d1a8c001f6475c5",
		},
		name: {
			type: "string",
			description: "The name of the meal.",
			example: "Classic Cheese",
		},
		desc: {
			type: "string",
			description: "A description of the meal.",
			example:
				"Pizza redonda grande de QuickFood cubierta con queso 100% Mozzarella y Muenster, recién salida del horno y lista cuando tú lo estés.",
		},
		price: {
			type: "number",
			format: "float",
			description: "The price of the meal.",
			example: 13.9,
		},
		image: {
			type: "string",
			description: "URL to the image of the meal.",
			example:
				"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565787/AlmuerziEasy/Pizza/jotqkfn2wbhpuunbn8xf.png",
		},
		quantity: {
			type: "integer",
			description: "The quantity available for the meal.",
			example: 10,
		},
		category: {
			type: "string",
			description: "The category of the meal.",
			example: "pizza",
		},
	},
	required: ["name", "desc", "price", "image", "quantity", "category"],
};

const getMealById = {
	tags: ["Meals"],
	summary: "Get a meal by ID",
	description: "Retrieve a meal by its unique ID.",
	operationId: "getMealById",
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: {
				type: "string",
				example: "60d5f60f8d1a8c001f6475c5",
			},
		},
	],
	responses: {
		200: {
			description: "A meal object",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/Meal",
					},
					examples: {
						ClassicCheese: {
							summary: "A Classic Cheese Pizza",
							value: {
								_id: "60d5f60f8d1a8c001f6475c5",
								name: "Classic Cheese",
								desc: "Pizza redonda grande de QuickFood cubierta con queso 100% Mozzarella y Muenster, recién salida del horno y lista cuando tú lo estés.",
								price: 13.9,
								image:
									"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565787/AlmuerziEasy/Pizza/jotqkfn2wbhpuunbn8xf.png",
								quantity: 10,
								category: "pizza",
							},
						},
					},
				},
			},
		},
		404: {
			description: "Meal not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Meal not found",
							},
						},
					},
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Error getting Meal",
							},
							error: {
								type: "string",
								example: "Detailed error message",
							},
						},
					},
				},
			},
		},
	},
};

const createMeals = {
	tags: ["Meals"],
	summary: "Create a new meal",
	description: "Create a new meal in the system.",
	operationId: "createMeals",
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/Meal",
				},
				examples: {
					ClassicCheese: {
						summary: "Classic Cheese Pizza",
						value: {
							name: "Classic Cheese",
							desc: "Pizza redonda grande de QuickFood cubierta con queso 100% Mozzarella y Muenster, recién salida del horno y lista cuando tú lo estés.",
							price: 13.9,
							image:
								"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565787/AlmuerziEasy/Pizza/jotqkfn2wbhpuunbn8xf.png",
							quantity: 10,
							category: "pizza",
						},
					},
				},
			},
		},
	},
	responses: {
		201: {
			description: "Meal created successfully",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/Meal",
					},
					examples: {
						ClassicCheese: {
							summary: "Classic Cheese Pizza",
							value: {
								_id: "60d5f60f8d1a8c001f6475c5",
								name: "Classic Cheese",
								desc: "Pizza redonda grande de QuickFood cubierta con queso 100% Mozzarella y Muenster, recién salida del horno y lista cuando tú lo estés.",
								price: 13.9,
								image:
									"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565787/AlmuerziEasy/Pizza/jotqkfn2wbhpuunbn8xf.png",
								quantity: 10,
								category: "pizza",
							},
						},
					},
				},
			},
		},
		400: {
			description: "Bad Request - Invalid input data",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Invalid input data",
							},
						},
					},
				},
			},
		},
		500: {
			description: "Internal Server Error - Problem creating the meal",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Error creating Meal",
							},
							error: {
								type: "string",
								example: "Detailed error message",
							},
						},
					},
				},
			},
		},
	},
};

const updateMealById = {
	tags: ["Meals"],
	summary: "Update a meal by ID",
	description: "Update a meal using its unique ID.",
	operationId: "updateMealById",
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: {
				type: "string",
				example: "60d5f60f8d1a8c001f6475c5",
			},
		},
	],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/Meal",
				},
				examples: {
					ClassicCheese: {
						summary: "A Classic Cheese Pizza",
						value: {
							name: "Classic Cheese",
							desc: "Pizza redonda grande de QuickFood cubierta con queso 100% Mozzarella y Muenster, recién salida del horno y lista cuando tú lo estés.",
							price: 13.9,
							image:
								"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565787/AlmuerziEasy/Pizza/jotqkfn2wbhpuunbn8xf.png",
							quantity: 10,
							category: "pizza",
						},
					},
				},
			},
		},
	},
	responses: {
		200: {
			description: "A meal object after update",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/Meal",
					},
					examples: {
						ClassicCheese: {
							summary: "A Classic Cheese Pizza",
							value: {
								_id: "60d5f60f8d1a8c001f6475c5",
								name: "Classic Cheese",
								desc: "Pizza redonda grande de QuickFood cubierta con queso 100% Mozzarella y Muenster, recién salida del horno y lista cuando tú lo estés.",
								price: 13.9,
								image:
									"https://res.cloudinary.com/djtzqnrmy/image/upload/v1720565787/AlmuerziEasy/Pizza/jotqkfn2wbhpuunbn8xf.png",
								quantity: 10,
								category: "pizza",
							},
						},
					},
				},
			},
		},
		404: {
			description: "Meal not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Meal not found",
							},
						},
					},
				},
			},
		},
		400: {
			description: "Invalid input data",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Invalid input data",
							},
							error: {
								type: "string",
								example: "Validation error details",
							},
						},
					},
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Error updating Meal",
							},
							error: {
								type: "string",
								example: "Detailed error message",
							},
						},
					},
				},
			},
		},
	},
};

const deleteMealById = {
	tags: ["Meals"],
	summary: "Delete a meal by ID",
	description: "Delete a meal using its unique ID.",
	operationId: "deleteMealById",
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: {
				type: "string",
				example: "60d5f60f8d1a8c001f6475c5",
			},
		},
	],
	responses: {
		204: {
			description: "Meal successfully deleted",
		},
		404: {
			description: "Meal not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Meal not found",
							},
						},
					},
				},
			},
		},
		500: {
			description: "Internal Server Error",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Error deleting Meal",
							},
							error: {
								type: "string",
								example: "Detailed error message",
							},
						},
					},
				},
			},
		},
	},
};

module.exports = {
	getAllMeals,
	Meal,
	getMealById,
	createMeals,
	updateMealById,
	deleteMealById,
};
