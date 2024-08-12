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
			description: "Bad Request - Validation Error",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Validation error: name must be at least 3 characters",
							},
						},
					},
				},
			},
		},
		409: {
			description: "Conflict - User already exists",
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
	required: ["name", "email", "password"],
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

const requestPasswordReset = {
	tags: ["Users"],
	description: "Send a password reset link to the user's email",
	operationId: "requestPasswordReset",
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/RequestPasswordResetBody",
				},
			},
		},
		required: true,
	},
	responses: {
		200: {
			description: "Password reset link sent successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Password reset link sent",
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
								example: "User doesn't exist",
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

const RequestPasswordResetBody = {
	type: "object",
	properties: {
		email: {
			type: "string",
			example: "user@example.com",
		},
	},
	required: ["email"],
};

const resetPassword = {
	tags: ["Users"],
	description: "Reset the user's password using the provided ID and token",
	operationId: "resetPassword",
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			schema: {
				type: "string",
				example: "60b8d295d4e8d2e7a35d99c4",
			},
		},
		{
			name: "token",
			in: "path",
			required: true,
			schema: {
				type: "string",
				example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
			},
		},
	],
	requestBody: {
		content: {
			"application/json": {
				schema: {
					$ref: "#/components/schemas/ResetPasswordBody",
				},
			},
		},
		required: true,
	},
	responses: {
		200: {
			description: "Password reset successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "Password has been reset successfully",
							},
						},
					},
				},
			},
		},
		400: {
			description: "User does not exist or invalid token",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: {
								type: "string",
								example: "User does not exist",
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

const ResetPasswordBody = {
	type: "object",
	properties: {
		password: {
			type: "string",
			example: "newStrongPassword123!",
		},
	},
	required: ["password"],
};

module.exports = {
	createUser,
	CreateUserBody,
	loginUser,
	LoginUserBody,
	getMe,
	getAllUsers,
	deleteUserById,
	requestPasswordReset,
	RequestPasswordResetBody,
	resetPassword,
	ResetPasswordBody,
};
