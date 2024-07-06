let mealsState = [];
let user = JSON.parse(localStorage.getItem("user")) ?? {};
let ruta = "login"; //login, register, orders

const stringToHTML = (str) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(str, "text/html");
	return doc.body.firstChild;
};

const renderItem = (item, index) => {
	const element = stringToHTML(`<li class="d-flex flex-column mb-2">
		<span class="text-uppercase fw-bold">Opción ${index + 1}</span>
		<p data-id=${
			item._id
		} class="mx-2 text-decoration-none" style="cursor:pointer;">${item.name}</p>
	</li>`);

	const link = element.querySelector("p");
	link.addEventListener("click", () => {
		const mealsList = document.getElementById("meals-list");
		Array.from(mealsList.querySelectorAll("p")).forEach((item) =>
			item.classList.remove("selected")
		);
		link.classList.add("selected");
		const mealsIdInput = document.getElementById("meals-id");
		mealsIdInput.value = item._id;
	});
	return element;
};

const renderOrder = async (order, meals) => {
	const orderByUser = await transformOrder(order);
	const meal = meals.find((meal) => meal._id === order.meal_id);
	const element =
		stringToHTML(`<li data-id="${order._id}" class="mb-2 d-flex justify-content-between align-content-center w-full">
	${meal.name}
	<span>-</span>
	<p class="text-danger fw-semibold">${orderByUser.user_id}</p>
</li>`);
	return element;
};

async function fetchUsers() {
	const token = localStorage.getItem("authToken");
	const response = await fetch(
		"https://almuerzieasy-backend.vercel.app/api/auth/users",
		{
			headers: {
				authorization: token,
			},
		}
	);
	const users = await response.json();
	return users;
}

async function transformOrder(order) {
	const users = await fetchUsers();
	const userMap = {};

	users.forEach((user) => {
		userMap[user._id] = user.email.split("@")[0];
	});

	const emailLocalPart = userMap[order.user_id];
	return {
		...order,
		user_id: emailLocalPart,
	};
}
const initializeForm = () => {
	const orderForm = document.getElementById("order");
	const token = localStorage.getItem("authToken");
	orderForm.onsubmit = async (e) => {
		e.preventDefault();
		const submit = document.getElementById("submit");
		submit.setAttribute("disabled", true);
		const mealId = document.getElementById("meals-id");
		const mealIdValue = mealId.value;
		if (!mealIdValue) {
			alert("Debe seleccionar un plato");
			submit.removeAttribute("disabled");
			submit.classList.remove("disabled");
			return;
		}
		const order = {
			meal_id: mealIdValue,
			user_id: user._id,
		};

		try {
			const response = await fetch(
				"https://almuerzieasy-backend.vercel.app/api/orders",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						authorization: token,
					},
					body: JSON.stringify(order),
				}
			);
			const respuesta = await response.json();
			const renderedOrder = await renderOrder(respuesta, mealsState);
			const ordersList = document.getElementById("orders-list");
			ordersList.appendChild(renderedOrder);
		} catch (error) {
			console.error("Error:", error);
			alert("Ocurrió un error al crear la orden. Inténtelo de nuevo.");
		} finally {
			submit.removeAttribute("disabled");
			submit.classList.remove("disabled");
		}
	};
};

const initializeData = () => {
	fetch("https://almuerzieasy-backend.vercel.app/api/meals", {
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
			mealsState = data;
			const mealsList = document.getElementById("meals-list");
			const submit = document.getElementById("submit");
			const listItems = data.map((element, index) =>
				renderItem(element, index)
			);
			mealsList.removeChild(mealsList.firstElementChild);
			listItems.forEach((element) => mealsList.appendChild(element));
			submit.removeAttribute("disabled");
			submit.classList.remove("disabled");
			fetch("https://almuerzieasy-backend.vercel.app/api/orders")
				.then((response) => response.json())
				.then(async (ordersData) => {
					const orderList = document.getElementById("orders-list");
					const listOrders = [];
					for (const orderData of ordersData) {
						const renderedOrder = await renderOrder(orderData, data);
						listOrders.push(renderedOrder);
					}
					orderList.removeChild(orderList.firstElementChild);
					listOrders.forEach((element) => orderList.appendChild(element));
				});
		});
};

// Función para mostrar un template y ocultar los demás
function showTemplate(templateId) {
	const token = localStorage.getItem("authToken");

	if (!token) {
		const authContainer = document.getElementById("auth-container");
		document.getElementById("app").innerHTML = authContainer.innerHTML;
		const templateContainer = document.getElementById("template-container");

		// Limpiar el contenedor de templates
		templateContainer.innerHTML = "";
		// Clonar el template y agregarlo al contenedor
		const template = document.getElementById(templateId);
		const clone = document.importNode(template.content, true);
		templateContainer.appendChild(clone);

		// Si es el formulario de registro, agregar el evento de envío
		if (templateId === "form-register") {
			const registerForm = document.getElementById("register-form");
			registerForm.addEventListener("submit", handleRegister);
		} else {
			const loginForm = document.getElementById("login-form");
			loginForm.addEventListener("submit", handleLogin);
		}
	} else {
		user = JSON.parse(localStorage.getItem("user"));
		return renderOrders();
	}
}

const renderOrders = () => {
	const ordersView = document.getElementById("orders-view");
	document.getElementById("app").innerHTML = ordersView.innerHTML;
	initializeForm();
	initializeData();
};

// Función para manejar el registro
function handleRegister(event) {
	event.preventDefault();

	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");
	const email = emailInput.value;
	const password = passwordInput.value;

	fetch("https://almuerzieasy-backend.vercel.app/api/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	})
		.then((response) => {
			if (!response.ok) {
				// Si la respuesta no es ok, lanzar un error
				return response.json().then((data) => {
					throw new Error(data);
				});
			}
			// Devolver el JSON de la respuesta
			return response.json();
		})
		.then((data) => {
			alert(data.message); // Mostrar el mensaje del servidor
			showTemplate("form-login"); //Mostramos el Template del Login
		})
		.catch((error) => {
			alert(error.message);
			console.error("Error:", error);
		});

	// Limpiar los campos del formulario
	emailInput.value = "";
	passwordInput.value = "";
}

// Función para manejar el login
function handleLogin(event) {
	event.preventDefault();

	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");
	const email = emailInput.value;
	const password = passwordInput.value;

	fetch("https://almuerzieasy-backend.vercel.app/api/auth/login", {
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
					throw new Error(data.message);
				});
			}
			// Devolver el JSON de la respuesta
			return response.json();
		})
		.then((data) => {
			if (data.token) {
				localStorage.setItem("authToken", data.token); // Guardar el token en localStorage
				ruta = "orders";
				return data.token;
			} else {
				alert(data.message || "Error en el inicio de sesión");
			}
		})
		.then((token) => {
			return fetch("https://almuerzieasy-backend.vercel.app/api/auth/me", {
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
			user = userData;
			renderOrders();
		})
		.catch((error) => {
			alert(error.message);
			console.error("Error:", error);
		});

	// Limpiar los campos del formulario
	emailInput.value = "";
	passwordInput.value = "";
}

window.onload = () => {
	// Mostrar el formulario de login por defecto al cargar la página
	showTemplate("form-login");

	// Hacer la función global para que pueda ser llamada desde los botones
	window.showTemplate = showTemplate;
};
