const getAllOrders = {
	tags: ["Orders"],
	description: "Get all orders from the system",
	operationId: "getAllOrders",
	responses: {
		200: {
			description: "A list of orders",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: {
							$ref: "#/components/schemas/Order",
						},
					},
					examples: {
						example1: {
							summary: "A list of orders",
							value: [
								{
									_id: "60d5f60f8d1a8c001f6475c6",
									meal_ids: [
										"60d5f60f8d1a8c001f6475c7",
										"60d5f60f8d1a8c001f6475c8",
									],
									user_id: "60d5f60f8d1a8c001f6475c9",
									created_at: "2024-07-23T15:25:30.000Z",
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
								example: "Error retrieving orders",
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

const Order = {
	type: "object",
	properties: {
		meal_ids: {
			type: "array",
			items: {
				type: "string",
				description: "List of meals identifiers in the order.",
				example: "60d5f60f8d1a8c001f6475c7",
			},
			description: "Meal identifiers in order.",
			example: ["60d5f60f8d1a8c001f6475c7", "60d5f60f8d1a8c001f6475c8"],
		},
		user_id: {
			type: "string",
			description: "The user identifier that made the order.",
			example: "60d5f60f8d1a8c001f6475c9",
		},
	},
	required: ["meal_ids", "user_id"],
};

const getOrderById = {
	tags: ["Orders"],
	summary: "Get an order by ID",
	description: "Retrieve an order by its unique ID.",
	operationId: "getOrderById",
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: {
				type: "string",
				description: "The unique identifier of the order.",
				example: "60d5f60f8d1a8c001f6475c6",
			},
		},
	],
	responses: {
		200: {
			description: "A single order object",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/Order",
					},
					examples: {
						ExampleOrder: {
							summary: "An example of an order",
							value: {
								_id: "60d5f60f8d1a8c001f6475c6",
								meal_ids: [
									"60d5f60f8d1a8c001f6475c7",
									"60d5f60f8d1a8c001f6475c8",
								],
								user_id: "60d5f60f8d1a8c001f6475c9",
								created_at: "2024-07-23T15:25:30.000Z",
							},
						},
					},
				},
			},
		},
		404: {
			description: "Order not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Order not found",
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
								example: "Error retrieving order",
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

const OrderSchema = {
	type: "object",
	properties: {
		meal_id: {
			type: "array",
			items: {
				type: "string",
				description: "ID of the meal",
				example: "60d5f60f8d1a8c001f6475c7",
			},
			description: "List of meal IDs included in the order",
			example: ["60d5f60f8d1a8c001f6475c7", "60d5f60f8d1a8c001f6475c8"],
		},
		quantity: {
			type: "integer",
			description: "Quantity of the meal to be ordered",
			example: 2,
		},
	},
	required: ["meal_id", "quantity"],
};

const CreateOrdersRequest = {
	type: "object",
	properties: {
		orders: {
			type: "array",
			items: OrderSchema,
			description: "Array of orders to be created",
		},
	},
	required: ["orders"],
};

const createOrders = {
	tags: ["Orders"],
	summary: "Create new orders",
	description:
		"Create new orders in the system. This endpoint processes multiple orders in a single request and handles inventory checks for meals.",
	operationId: "createOrders",
	security: [
		{
			bearerAuth: [],
		},
	],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: CreateOrdersRequest,
				examples: {
					ExampleOrderRequest: {
						summary: "An example of order creation request",
						value: {
							orders: [
								{
									meal_id: ["60d5f60f8d1a8c001f6475c7"],
									quantity: 2,
								},
								{
									meal_id: ["60d5f60f8d1a8c001f6475c8"],
									quantity: 1,
								},
							],
						},
					},
				},
			},
		},
	},
	responses: {
		201: {
			description: "Orders successfully created",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: {
							$ref: "#/components/schemas/Order",
						},
					},
					examples: {
						ExampleOrderResponse: {
							summary: "An example of created orders response",
							value: [
								{
									_id: "60d5f60f8d1a8c001f6475c6",
									meal_ids: ["60d5f60f8d1a8c001f6475c7"],
									user_id: "60d5f60f8d1a8c001f6475c9",
									created_at: "2024-07-23T15:25:30.000Z",
								},
							],
						},
					},
				},
			},
		},
		400: {
			description: "Bad request - invalid input data or out of stock",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Orders must be an array that is not empty",
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
								example: "Error creating order",
							},
							details: {
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

const updateOrderById = {
	tags: ["Orders"],
	description: "Update an order by its ID",
	operationId: "updateOrderById",
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: {
				type: "string",
				description: "The unique identifier of the order to update",
				example: "60d5f60f8d1a8c001f6475c6",
			},
		},
	],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/Order",
				},
			},
		},
	},
	responses: {
		200: {
			description: "Order successfully updated",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/Order",
					},
				},
			},
		},
		404: {
			description: "Order not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Order not found",
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
								example: "Error updating order",
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

const deleteOrderById = {
	tags: ["Orders"],
	description: "Delete an order by ID",
	operationId: "deleteOrderById",
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: {
				type: "string",
				description: "The unique identifier for the order.",
				example: "60d5f60f8d1a8c001f6475c6",
			},
		},
	],
	responses: {
		204: {
			description: "Order successfully deleted",
		},
		404: {
			description: "Order not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Order not found",
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
								example: "Error deleting order",
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
	getAllOrders,
	Order,
	getOrderById,
	createOrders,
	OrderSchema,
	CreateOrdersRequest,
	updateOrderById,
	deleteOrderById,
};
