import { transformOrder } from "./auth.js";
import { stringToHTML } from "./utils.js";

export const renderOrder = (orders, meals) => {
	const orderList = document.getElementById("order-list");
	orders.forEach(async (order) => {
		const orderElement = await renderOrderItem(order, meals);
		orderList.appendChild(orderElement);
	});
};

export const renderPlaceHolderOrders = () => {
	const placeholderHTML = `<div class="col-lg-4 col-md-6">
		<div class="card order-card rounded-4 h-100">
			<div class="row g-0">
				<div class="col-md-5">
					<svg class="bd-placeholder-img img-fluid rounded-start" width="100%"
						height="175" xmlns="http://www.w3.org/2000/svg" role="img"
						aria-label="Placeholder: Image" preserveAspectRatio="xMidYMid slice"
						focusable="false">
						<title>Placeholder</title>
						<rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%"
							fill="#dee2e6" dy=".3em"></text>
					</svg>
				</div>
				<div class="col-md-7">
					<div class="card-body text-start placeholder-glow d-flex flex-column">
						<h4 class="card-title placeholder bg-secondary col-9 mb-4"></h4>
						<h5 class="card-text placeholder bg-secondary col-4 mb-2"></h5>
						<p class="card-text placeholder bg-secondary col-4 mb-4"></p>
						<p class="card-text placeholder bg-secondary col-9"><small
								class="text-body-secondary"></small>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	const orderList = document.getElementById("order-list");
	for (let i = 0; i < 3; i++) {
		const placeholderElement = stringToHTML(placeholderHTML);
		orderList.appendChild(placeholderElement);
	}
};

export function timeAgo(date) {
	const now = new Date();
	const secondsPast = (now.getTime() - date.getTime()) / 1000;

	if (secondsPast < 60) {
		return `${Math.floor(secondsPast)} seconds ago`;
	}
	if (secondsPast < 3600) {
		return `${Math.floor(secondsPast / 60)} minutes ago`;
	}
	if (secondsPast < 86400) {
		return `${Math.floor(secondsPast / 3600)} hours ago`;
	}
	if (secondsPast < 2592000) {
		return `${Math.floor(secondsPast / 86400)} days ago`;
	}
	if (secondsPast < 31536000) {
		return `${Math.floor(secondsPast / 2592000)} months ago`;
	}
	return `${Math.floor(secondsPast / 31536000)} years ago`;
}

export const renderOrderItem = async (order, meals) => {
	const orderMeals = order.meal_ids.map((meal_id) =>
		meals.find((meal) => meal._id === meal_id)
	);

	if (orderMeals.includes(undefined)) {
		console.error(
			"One or more meal_ids in the order do not match any meal in mealsState."
		);
		return;
	}

	const orderByUser = await transformOrder(order);
	const timeAgoText = timeAgo(new Date(order.created_at));

	const element = stringToHTML(`
	<div class="col-lg-4 col-md-6 col-12">
		<div class="card order-card mb-2 rounded-4 h-100">
			<div class="row g-0">
				<div class="col-md-5 col-5 d-flex justify-content-center align-items-center">
					<img src="${orderMeals[0].image}" class="img-fluid rounded-start" alt="${
		orderMeals[0].name
	}">
				</div>
				<div class="col-md-7 col-7">
					<div class="card-body text-start">
						<h4 class="card-title fs-5 fw-bold text-black mb-2">${orderMeals[0].name}</h4>
						<h5 class="card-text fw-semibold text-primario fs-6">${orderByUser.user_id}</h5>
						<p class="card-text fw-bold fs-5 text-black">$${orderMeals[0].price.toFixed(
							2
						)}</p>
						<p class="card-text"><small class="text-body-secondary">Last updated ${timeAgoText}</small></p>
					</div>
				</div>
			</div>
		</div>
	</div>
	`);
	return element;
};
