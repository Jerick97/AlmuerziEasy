import {
	selectedMeals,
	updateSelectedMeals,
	user,
	mealsState,
	updateMealsState,
	updateRoute,
	updateUser,
} from "./config.js";
import { renderMeals, renderPlaceholderMeals, updateCart } from "./meals.js";
import { renderOrder, renderPlaceHolderOrders } from "./orders.js";

const initializeForm = () => {
	const orderForm = document.getElementById("order");
	const token = localStorage.getItem("authToken");
	const submit = document.getElementById("submit");

	orderForm.onsubmit = async (e) => {
		e.preventDefault();

		if (selectedMeals.length === 0) {
			alert("Debe seleccionar al menos un plato");
			submit.classList.add("disabled");
			submit.setAttribute("disabled", true); // Deshabilitar el botón físicamente
			return;
		}

		const orders = selectedMeals.map((meal) => ({
			meal_id: [meal._id],
			user_id: user._id,
			quantity: meal.quantity,
		}));

		try {
			const response = await fetch(
				"https://almuerzieasy-backend.vercel.app/api/v1/orders",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						authorization: token,
					},
					body: JSON.stringify({ orders }),
				}
			);

			const respuesta = await response.json();

			if (response.ok) {
				if (Array.isArray(respuesta)) {
					renderOrder(respuesta, mealsState);
					updateSelectedMeals([]);
					updateCart();
					Toastify({
						text: "Se realizo la Orden con éxito",
						style: {
							background: "linear-gradient(to right, #00b09b, #96c93d)",
						},
					}).showToast();
				} else {
					console.error("Respuesta no es un array:", respuesta);
					Toastify({
						text: "Ocurrió un error inesperado.",
						style: {
							background: "linear-gradient(to right, #ff5f6d, #ffc371)",
						},
					}).showToast();
				}
			} else {
				Toastify({
					text: `${respuesta.message}`,
					style: {
						background: "linear-gradient(to right, #ff5f6d, #ffc371)",
					},
				}).showToast();
			}
		} catch (error) {
			console.error("Error:", error);
			Toastify({
				text: "Ocurrió un error al crear la orden. Inténtelo de nuevo.",
				style: {
					background: "linear-gradient(to right, #ff5f6d, #ffc371)",
				},
			}).showToast();
		}
	};
};

const initializeData = () => {
	renderPlaceholderMeals(); // Render placeholders before fetching data
	renderPlaceHolderOrders(); // Render order placeholders
	if (selectedMeals.length > 0) {
		submit.classList.remove("disabled");
		submit.removeAttribute("disabled"); // Habilitar el botón físicamente
	} else {
		submit.classList.add("disabled");
		submit.setAttribute("disabled", true); // Deshabilitar el botón físicamente
		document.querySelector(".total-price").textContent = "$5.00";
	}
	fetch("https://almuerzieasy-backend.vercel.app/api/v1/meals", {
		method: "GET",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow",
	})
		.then((response) => response.json())
		.then((data) => {
			updateMealsState(data);
			const mealsList = document.getElementById("meals-list");
			mealsList.innerHTML = ""; // Clear all placeholders
			renderMeals(mealsState);

			// Fetch orders after fetching meals
			return fetch("https://almuerzieasy-backend.vercel.app/api/v1/orders");
		})
		.then((response) => response.json())
		.then(async (ordersData) => {
			const orderList = document.getElementById("order-list");
			orderList.innerHTML = ""; // Clear all placeholders
			renderOrder(ordersData, mealsState); // Pass mealsState to renderOrder
		})
		.catch((error) => {
			console.error("Error fetching data:", error);
		});
};

// Función auxiliar para cargar y mostrar templates
async function loadAndShowTemplate(templateName) {
	try {
		const response = await fetch(`templates/${templateName}.html`);
		const templateText = await response.text();
		const tempElement = document.createElement("div");
		tempElement.innerHTML = templateText;
		const template = tempElement.querySelector("template");
		if (template) {
			const app = document.getElementById("app");
			app.innerHTML = "";
			app.appendChild(template.content.cloneNode(true));
			// Agregar el evento de envío del formulario si es necesario
			attachFormEventListeners(templateName);
		} else {
			console.error("No template found in the file:", templateName);
		}
	} catch (error) {
		console.error("Error loading template:", error);
	}
}

// Función para mostrar un template y ocultar los demás
async function showTemplate(templateName) {
	const token = localStorage.getItem("authToken");
	const queryParams = getQueryParams();
	if (queryParams.id && queryParams.token && !token) {
		// Si la URL tiene id y token, mostramos el template de resetpassword
		await loadAndShowTemplate("reset-password");
	} else if (!token) {
		// Si no hay token y no es el template de resetpassword, mostramos el login o el template predeterminado
		await loadAndShowTemplate(templateName);
	} else {
		return renderOrders();
	}
}

function attachFormEventListeners(templateName) {
	const form = document.querySelector("form");
	if (!form) return;

	switch (templateName) {
		case "register":
			form.id = "register-form";
			form.addEventListener("submit", handleRegister);
			break;
		case "login":
			form.id = "login-form";
			form.addEventListener("submit", handleLogin);
			break;
		case "forgot-password":
			form.id = "forgot-password-form";
			form.addEventListener("submit", handleForgotPassword);
			break;
		case "reset-password":
			form.id = "reset-password-form";
			form.addEventListener("submit", handleResetPassword);
			break;
		default:
			console.warn("Unknown template:", templateName);
			break;
	}
}

const renderOrders = async () => {
	try {
		const response = await fetch("templates/main.html");
		const templateText = await response.text();
		const tempElement = document.createElement("div");
		tempElement.innerHTML = templateText.trim();
		const template = tempElement.querySelector("template");

		if (template) {
			const app = document.getElementById("app");
			app.innerHTML = "";
			app.appendChild(template.content.cloneNode(true));
		} else {
			console.error("No <template> element found in main.html");
		}
	} catch (error) {
		console.error("Error loading template:", error);
	}
	initializeForm();
	initializeData();

	const navbar = document.getElementById("navbar");
	const navbarToggler = document.querySelector(".navbar-toggler");
	const navbarCollapse = document.getElementById("navbarTogglerDemo02");

	window.addEventListener("scroll", function () {
		if (window.scrollY > 50) {
			navbar.classList.add("navbar-hover");
		} else {
			navbar.classList.remove("navbar-hover");
		}
	});

	navbarToggler.addEventListener("click", function () {
		if (!navbarCollapse.classList.contains("show")) {
			navbar.classList.add("navbar-open");
		} else {
			navbar.classList.remove("navbar-open");
		}
	});

	navbarCollapse.addEventListener("shown.bs.collapse", function () {
		if (window.scrollY <= 50) {
			navbar.classList.add("navbar-open");
		}
	});

	navbarCollapse.addEventListener("hidden.bs.collapse", function () {
		navbar.classList.remove("navbar-open");
	});

	window.addEventListener("resize", function () {
		const mdBreakpoint = 768;
		if (window.innerWidth >= mdBreakpoint) {
			navbar.classList.remove("navbar-open");
			navbarCollapse.classList.remove("show");
		}
	});

	updateCart();
};

function handleForgotPassword(event) {
	event.preventDefault();
	const data = new FormData(event.target);
	const dataObject = Object.fromEntries(data.entries());
	fetch("https://almuerzieasy-backend.vercel.app/api/v1/auth/forgot-password", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(dataObject),
	})
		.then((response) => {
			if (!response.ok) {
				// Si la respuesta no es ok, lanzar un error con el mensaje de la respuesta
				return response.json().then((data) => {
					throw new Error(data.message || "An error occurred");
				});
			}
			// Devolver el JSON de la respuesta
			return response.json();
		})
		.then((data) => {
			// Mostrar el mensaje del servidor
			Toastify({
				text: `${data.message}`,
				style: {
					background: "linear-gradient(to right, #00b09b, #96c93d)",
				},
			}).showToast();
			showTemplate("login"); // Mostramos el Template del Login
		})
		.catch((error) => {
			// Mostrar el mensaje de error
			Toastify({
				text: `${error.message}`,
				style: {
					background: "linear-gradient(to right, #ff5f6d, #ffc371)",
				},
			}).showToast();
			console.error("Error:", error);
		});
}

function handleResetPassword(event) {
	event.preventDefault();

	// Obtener parámetros de consulta
	const queryParams = getQueryParams();
	const { id, token } = queryParams;

	// Obtener los datos del formulario
	const data = new FormData(event.target);
	const dataObject = Object.fromEntries(data.entries());

	// Validar que las contraseñas coincidan
	if (dataObject.password !== dataObject["password-confirm"]) {
		Toastify({
			text: "Passwords do not match.",
			style: {
				background: "linear-gradient(to right, #ff5f6d, #ffc371)",
			},
		}).showToast();
		return;
	}

	// Construir la URL con los parámetros id y token
	const url = `https://almuerzieasy-backend.vercel.app/api/v1/auth/reset-password/${id}/${token}`;

	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ password: dataObject.password }), // Solo enviar la nueva contraseña
	})
		.then((response) => {
			if (!response.ok) {
				// Si la respuesta no es ok, lanzar un error con el mensaje de la respuesta
				return response.json().then((data) => {
					throw new Error(data.message || "An error occurred");
				});
			}
			// Devolver el JSON de la respuesta
			return response.json();
		})
		.then((data) => {
			// Mostrar el mensaje del servidor
			Toastify({
				text: `${data.message}`,
				style: {
					background: "linear-gradient(to right, #00b09b, #96c93d)",
				},
			}).showToast();
			window.location.replace("https://almuerzieasy.vercel.app");
		})
		.catch((error) => {
			// Mostrar el mensaje de error
			Toastify({
				text: `${error.message}`,
				style: {
					background: "linear-gradient(to right, #ff5f6d, #ffc371)",
				},
			}).showToast();
			console.error("Error:", error);
		});
}

function handleRegister(event) {
	event.preventDefault();

	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");
	const nameInput = document.getElementById("name");
	const email = emailInput.value;
	const password = passwordInput.value;
	const name = nameInput.value;

	fetch("https://almuerzieasy-backend.vercel.app/api/v1/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password, name }),
	})
		.then((response) => {
			if (!response.ok) {
				// Si la respuesta no es ok, lanzar un error con el mensaje de la respuesta
				return response.json().then((data) => {
					throw new Error(data.message || "An error occurred");
				});
			}
			// Devolver el JSON de la respuesta
			return response.json();
		})
		.then((data) => {
			// Mostrar el mensaje del servidor
			Toastify({
				text: `${data.message}`,
				style: {
					background: "linear-gradient(to right, #00b09b, #96c93d)",
				},
			}).showToast();
			showTemplate("login"); // Mostramos el Template del Login
		})
		.catch((error) => {
			// Mostrar el mensaje de error
			Toastify({
				text: `${error.message}`,
				style: {
					background: "linear-gradient(to right, #ff5f6d, #ffc371)",
				},
			}).showToast();
			console.error("Error:", error);
		});

	// Limpiar los campos del formulario
	emailInput.value = "";
	passwordInput.value = "";
	nameInput.value = "";
}

// Función para manejar el login
function handleLogin(event) {
	event.preventDefault();

	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");
	const email = emailInput.value;
	const password = passwordInput.value;

	fetch("https://almuerzieasy-backend.vercel.app/api/v1/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	})
		.then((response) => {
			if (!response.ok) {
				// Si la respuesta no es ok, intentar analizar el JSON de error
				return response.json().then((data) => {
					throw new Error(data.message || "An error occurred");
				});
			}
			// Devolver el JSON de la respuesta
			return response.json();
		})
		.then((data) => {
			if (data.token) {
				localStorage.setItem("authToken", data.token); // Guardar el token en localStorage
				updateRoute("orders");
				return data.token;
			} else {
				Toastify({
					text: `${data.message}`,
					style: {
						background: "linear-gradient(to right, #ff5f6d, #ffc371)",
					},
				}).showToast();
			}
		})
		.then((token) => {
			return fetch("https://almuerzieasy-backend.vercel.app/api/v1/auth/me", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
			});
		})
		.then((data) => data.json())
		.then((userData) => {
			localStorage.setItem("user", JSON.stringify(userData));
			updateUser(userData);
			renderOrders();
		})
		.catch((error) => {
			Toastify({
				text: `${error.message}`,
				style: {
					background: "linear-gradient(to right, #ff5f6d, #ffc371)",
				},
			}).showToast();
			console.error("Error:", error);
		});

	// Limpiar los campos del formulario
	emailInput.value = "";
	passwordInput.value = "";
}

function logout() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("user");
	localStorage.removeItem("cart");
	showTemplate("login");
}

//Función para obtener los parámetros de la URL

function getQueryParams() {
	const params = new URLSearchParams(window.location.search);
	return {
		id: params.get("id"),
		token: params.get("token"),
	};
}

window.onload = () => {
	// Mostrar el formulario de login por defecto al cargar la página
	showTemplate("login");

	// Hacer la función global para que pueda ser llamada desde los botones
	window.showTemplate = showTemplate;

	window.logout = logout;
};
