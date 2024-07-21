export async function fetchUsers() {
	const token = localStorage.getItem("authToken");
	const response = await fetch(
		"https://almuerzieasy-backend.vercel.app/api/v1/auth/users",
		{
			headers: {
				authorization: token,
			},
		}
	);
	const users = await response.json();
	return users;
}

export async function transformOrder(order) {
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
