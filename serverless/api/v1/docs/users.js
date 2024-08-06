const createUser = {
	tags: ["Users"],
	description: "Create a new user in the system",
	operationId: "createUser",
	security: [
		{
			bearerAuth: [],
		},
	],
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/CreateUserBody",
				},
			},
		},
		required: true,
	},
	responses: {
		201: {
			description: "User created successfully!",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "User created successfully!",
							},
						},
					},
				},
			},
		},
		400: {
			description: "User already exists",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "User already exists",
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
								example: "Internal Server Error",
							},
						},
					},
				},
			},
		},
	},
};

const CreateUserBody = {
	type: "object",
	properties: {
		name: {
			type: "string",
			example: "jhon snow",
		},
		email: {
			type: "string",
			example: "john.snow@email.com",
		},
		password: {
			type: "string",
			description: "unencrypted user's password",
			example: "!1234aWe1Ro3$#",
		},
		role: {
			type: "string",
			example: "user",
		},
	},
	required: ["email", "password"],
};

const loginUser = {
	tags: ["Users"],
	description: "Login a user in the system",
	operationId: "loginUser",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/LoginUserBody",
				},
			},
		},
		required: true,
	},
	responses: {
		200: {
			description: "User logged in successfully!",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							token: {
								type: "string",
								example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
							},
						},
					},
				},
			},
		},
		401: {
			description: "Invalid email or password",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Invalid email or password",
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
								example: "Internal Server Error",
							},
						},
					},
				},
			},
		},
	},
};

const LoginUserBody = {
	type: "object",
	properties: {
		email: {
			type: "string",
			example: "john.snow@email.com",
		},
		password: {
			type: "string",
			example: "!1234aWe1Ro3$#",
		},
	},
	required: ["email", "password"],
};

const getMe = {
	tags: ["Users"],
	description: "Get the authenticated user's details",
	operationId: "getMe",
	security: [
		{
			bearerAuth: [],
		},
	],
	responses: {
		200: {
			description: "User details retrieved successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							_id: {
								type: "string",
								example: "60564fcb544047cdc3844818",
							},
							email: {
								type: "string",
								example: "john.snow@email.com",
							},
							role: {
								type: "string",
								example: "user",
							},
						},
					},
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Unauthorized",
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
								example: "Internal Server Error",
							},
						},
					},
				},
			},
		},
	},
};

const getAllUsers = {
	tags: ["Users"],
	description: "Retrieve a list of all users in the system",
	operationId: "getAllUsers",
	security: [
		{
			bearerAuth: [],
		},
	],
	responses: {
		200: {
			description: "List of users retrieved successfully",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: {
							type: "object",
							properties: {
								_id: {
									type: "string",
									example: "60564fcb544047cdc3844818",
								},
								email: {
									type: "string",
									example: "john.snow@email.com",
								},
								role: {
									type: "string",
									example: "user",
								},
							},
							required: ["_id", "email", "role"],
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
								example: "Error retrieving users",
							},
						},
					},
				},
			},
		},
	},
};

const deleteUserById = {
	tags: ["Users"],
	description: "Delete a user by their ID",
	operationId: "deleteUserById",
	security: [
		{
			bearerAuth: [],
		},
	],
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			description: "The ID of the user to delete",
			schema: {
				type: "string",
				example: "60564fcb544047cdc3844818",
			},
		},
	],
	responses: {
		200: {
			description: "User successfully deleted",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "User successfully deleted",
							},
						},
					},
				},
			},
		},
		404: {
			description: "User not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "User not found",
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
								example: "Error deleting user",
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
	createUser,
	CreateUserBody,
	loginUser,
	LoginUserBody,
	getMe,
	getAllUsers,
	deleteUserById,
};
