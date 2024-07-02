let mealsState = [];

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

const renderOrder = (order, meals) => {
	const meal = meals.find((meal) => meal._id === order.meal_id);
	const element =
		stringToHTML(`<li data-id="${order._id}" class="mb-2 d-flex justify-content-between align-content-center w-full">
	${meal.name}
	<span>-</span>
	<p class="text-danger fw-semibold">
		${order.user_id}</p>
</li>`);
	return element;
};

window.onload = () => {
	const orderForm = document.getElementById("order");
	orderForm.onsubmit = (e) => {
		e.preventDefault();
		const submit = document.getElementById("submit");
		submit.setAttribute("disabled", true);
		const mealId = document.getElementById("meals-id");
		const mealIdValue = mealId.value;
		if (!mealIdValue) {
			alert("Debe seleccionar un plato");
			return;
		}
		const order = {
			meal_id: mealIdValue,
			user_id: "Esther",
		};

		fetch("https://almuerzieasy-backend.vercel.app/api/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		})
			.then((x) => x.json())
			.then((respuesta) => {
				const renderedOrder = renderOrder(respuesta, mealsState);
				const ordersList = document.getElementById("orders-list");
				ordersList.appendChild(renderedOrder);
				submit.removeAttribute("disabled");
				submit.classList.remove("disabled");
			});
	};
	fetch("https://almuerzieasy-backend.vercel.app/api/meals", {
		method: "GET", //POST, PUT, DELETE
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
				.then((ordersData) => {
					const orderList = document.getElementById("orders-list");
					const listOrders = ordersData.map((orderData) =>
						renderOrder(orderData, data)
					);
					orderList.removeChild(orderList.firstElementChild);
					listOrders.forEach((element) => orderList.appendChild(element));
				});
		});
};
