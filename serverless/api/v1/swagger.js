const {
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
} = require("./docs/users");
const {
	getAllMeals,
	Meal,
	getMealById,
	createMeals,
	updateMealById,
	deleteMealById,
} = require("./docs/meals");
const {
	getAllOrders,
	Order,
	getOrderById,
	createOrders,
	OrderSchema,
	CreateOrdersRequest,
	updateOrderById,
	deleteOrderById,
} = require("./docs/orders");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const CSS_URL =
	"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

// Metadata info about our API
const swaggerOptions = {
	definition: {
		openapi: "3.0.1",
		info: {
			version: "1.0.0",
			title: "AlmuerziEasy - Documentation",
			description:
				"Esta es una aplicación de API REST hecha con Express. Recupera datos del backend.",
			license: {
				name: "Licensed Under MIT",
				url: "https://spdx.org/licenses/MIT.html",
			},
			contact: {
				name: "AlmuerziEasy API",
				url: "https://almuerzieasy.vercel.app",
				email: "emersonsuarez2904@gmail.com",
			},
		},
		servers: [
			{
				url: "http://localhost:3000/api/v1",
				description: "Development server",
			},
			{
				url:
					process.env.API_HOST ||
					"https://almuerzieasy-backend.vercel.app/api/v1",
				description: "Production server",
			},
		],
		tags: [
			{
				name: "Users",
			},
			{
				name: "Meals",
			},
			{
				name: "Orders",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				CreateUserBody,
				LoginUserBody,
				RequestPasswordResetBody,
				ResetPasswordBody,
				Meal,
				Order,
				OrderSchema,
				CreateOrdersRequest,
			},
		},
		paths: {
			"/auth/register": {
				post: createUser,
			},
			"/auth/login": {
				post: loginUser,
			},
			"/auth/me": {
				get: getMe,
			},
			"/auth/users": {
				get: getAllUsers,
			},
			"/auth/users/{id}": {
				delete: deleteUserById,
			},
			"/auth/forgot-password": {
				post: requestPasswordReset,
			},
			"/auth/reset-password/:id/:token": {
				post: resetPassword,
			},
			"/meals": { get: getAllMeals, post: createMeals },
			"/meals/{id}": {
				get: getMealById,
				put: updateMealById,
				delete: deleteMealById,
			},
			"/orders": {
				get: getAllOrders,
				post: createOrders,
			},
			"/orders/{id}": {
				get: getOrderById,
				put: updateOrderById,
				delete: deleteOrderById,
			},
		},
	},
	apis: ["./v1/routes/*.js", "./v1/docs/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app) => {
	// Swagger Page
	app.use(
		"/api/v1/docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerDocs, {
			customCss:
				".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; } .swagger-ui .opblock .opblock-summary-path-description-wrapper .opblock-summary-path{word-break: inherit; align-items: center;color: #3b4151;display: flex;font-family: monospace;font-weight: 600;padding: 0 10px;} @media (max-width: 768px) {.swagger-ui .scheme-container .schemes {flex-direction: column;align-items: flex-start;}} .scheme-container .schemes .schemes-server-container{width: 100%;box-sizing: border-box;max-width: 100%;} .swagger-ui .btn.authorize {background-color: transparent;border-color: #49cc90;color: #49cc90;display: inline;line-height: 1;white-space: nowrap;}",
			customCssUrl: CSS_URL,
			customfavIcon:
				"https://static1.smartbear.co/swagger/media/assets/swagger_fav.png",
		})
	);

	// Documentation in JSON format
	app.get("/api/v1/docs.json", (req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerDocs);
	});
};

module.exports = setupSwagger;
