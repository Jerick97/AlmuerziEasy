export let user = JSON.parse(localStorage.getItem("user")) ?? {};
export let mealsState = [];
export let ruta = "login"; //login, register, orders
export let selectedMeals = JSON.parse(localStorage.getItem("cart")) ?? [];

export const updateUser = (newUser) => {
	user = newUser;
	localStorage.setItem("user", JSON.stringify(user));
};

export const updateSelectedMeals = (newSelectedMeals) => {
	selectedMeals = newSelectedMeals;
	localStorage.setItem("cart", JSON.stringify(selectedMeals));
};

export const updateRoute = (newRuta) => {
	ruta = newRuta;
};

export const updateMealsState = (newMealsState) => {
	mealsState = newMealsState;
};
