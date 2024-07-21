import { stringToHTML } from "./utils.js";
import { delivery, selectedMeals, updateSelectedMeals } from "./config.js";

export const renderMeals = (meals) => {
	const mealsList = document.getElementById("meals-list");
	meals.forEach((meal, index) => {
		const mealElement = renderItem(meal, index);
		mealsList.appendChild(mealElement);
	});
};

export const updateCart = () => {
	const cartItemsContainer = document.getElementById("cart-items-container");
	cartItemsContainer.innerHTML = ""; // Clear existing items

	let subtotal = 0;

	selectedMeals.forEach((meal, index) => {
		subtotal += meal.price; // Sum the price of each selected meal
		const cartItem = stringToHTML(`
		<div class="row g-2 d-flex justify-content-center align-items-center mb-3 position-relative overflow-hidden">
			<div class="col-3">
				<img class="img-fluid" src="${meal.image}" alt="${meal.name}">
			</div>
			<div class="col-6">
				<h4 class="fw-semibold text-secondary fs-5">${meal.name}</h4>
				<p class="fw-semibold">Cantidad: <span class="fw-medium">1</span></p>
			</div>
			<div class="col-3">
				<h4 class="fw-semibold">$${meal.price}</h4>
			</div>
			<i class="bi bi-x position-absolute left-0 bottom-50 p-2 fs-4 remove-item" style="cursor: pointer; z-index: 1; transform: translate(88%, -35%);"></i>
			<div class="border-2 border-bottom border-light mb-2 w-100"></div>
		</div>
		`);
		const removeButton = cartItem.querySelector(".remove-item");
		removeButton.addEventListener("click", () => {
			removeMealFromCart(index);
		});

		cartItemsContainer.appendChild(cartItem);
	});

	const total = subtotal + delivery;
	const countElements = document.querySelectorAll(".count");
	countElements.forEach((element) => {
		element.innerHTML = `+${selectedMeals.length}`;
	});
	document.querySelector(".subtotal-price").textContent = `$${subtotal.toFixed(
		2
	)}`;
	document.querySelector(".total-price").textContent = `$${total.toFixed(2)}`;
};

// Función para eliminar un producto del carrito
export const removeMealFromCart = (index) => {
	selectedMeals.splice(index, 1); // Elimina el producto del array
	localStorage.setItem("cart", JSON.stringify(selectedMeals)); // Actualiza el almacenamiento local
	updateSelectedMeals(selectedMeals); // Actualiza el estado global
	updateCart(); // Actualiza la visualización del carrito
	checkSubmitButtonState();
};

export const renderItem = (item, index) => {
	const element = stringToHTML(`
	<div class="col-lg-3 col-md-6 col-sm-6 col-12">
    <div class="card meals-container rounded-4 p-2 shadow-lg h-100">
        <div class="meal-shadow d-flex justify-content-center align-items-center">
            <img src="${item.image}"
                class="card-img-top rounded-4 img-responsive" alt="${item.name}">
        </div>
        <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title card-title-meals fw-bold text-center fs-4">${item.name}</h5>
            <p class="card-text text-secondary fw-medium text-center">${item.desc}</p>
            <div>
                <div class="d-flex justify-content-between align-items-center">
                    <p class="fw-bold text-center fs-3 my-auto price-card-order">$${item.price}</p>
                    <button class="add-to-cart-btn" title="Add to Cart" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <i class="bi bi-cart-plus-fill fs-3 text-white"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
	`);

	const button = element.querySelector(".add-to-cart-btn");
	button.addEventListener("click", () => {
		const existingMealIndex = selectedMeals.findIndex(
			(meal) => meal._id === item._id
		);
		if (existingMealIndex !== -1) {
			selectedMeals.splice(existingMealIndex, 1); // Remove if already exists
			localStorage.setItem("cart", JSON.stringify(selectedMeals));
			updateSelectedMeals(selectedMeals);
		} else {
			selectedMeals.push(item); // Add new meal
			localStorage.setItem("cart", JSON.stringify(selectedMeals));
			updateSelectedMeals(selectedMeals);
		}
		updateCart();
		checkSubmitButtonState();
	});

	return element;
};

// Verifica si existen Productos Seleccionados
export const checkSubmitButtonState = () => {
	if (selectedMeals.length > 0) {
		submit.classList.remove("disabled");
		submit.removeAttribute("disabled"); // Habilitar el botón físicamente
	} else {
		submit.classList.add("disabled");
		submit.setAttribute("disabled", true); // Deshabilitar el botón físicamente
		document.querySelector(".total-price").textContent = `$${delivery}.00`;
	}
};

export const renderPlaceholderMeals = () => {
	const placeholderHTML = `
	<div class="col-lg-3 col-md-6 col-sm-6 col-12">
		<div class="card rounded-4 p-2 shadow-lg">
			<svg class="bd-placeholder-img card-img-top" width="100%" height="140"
				xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap"
				preserveAspectRatio="xMidYMid slice" focusable="false">
				<title>Placeholder</title>
				<rect width="100%" height="100%" fill="#868e96"></rect>
			</svg>
			<div class="card-body placeholder-glow">
				<h5 class="card-title placeholder bg-light col-6"></h5>
				<p class="card-text placeholder-glow">
					<span class="placeholder bg-light col-7"></span>
					<span class="placeholder bg-light col-4"></span>
					<span class="placeholder bg-light col-4"></span>
					<span class="placeholder bg-light col-6"></span>
					<span class="placeholder bg-light col-8"></span>
				</p>
				<div class="d-flex justify-content-between align-items-center placeholder-glow">
					<p class="fw-bold text-center fs-4 my-auto price-card-order placeholder bg-light col-4"></p>
					<button class="btn btn-success disabled placeholder col-6"></button>
				</div>
			</div>
		</div>
	</div>`;

	const mealsList = document.getElementById("meals-list");
	for (let i = 0; i < 4; i++) {
		const placeholderElement = stringToHTML(placeholderHTML);
		mealsList.appendChild(placeholderElement);
	}
};
