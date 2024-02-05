document.addEventListener('DOMContentLoaded', function() {
	const form = document.querySelector('form');

	form.addEventListener('submit', function(event) {
		event.preventDefault();

		const formData = new FormData(form);
		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');

		console.log({
			username: username,
			email: email,
			password: password,
			confirmPassword: confirmPassword
		});

		//	check email for kutztown
		function checkEmail(email) {
			const domain = "@live.kutztown.edu";
			const emailRegex = new RegExp(`${domain}$`, "i");
			return emailRegex.test(email);
		}

		// example usage
		const email1 = "john.doe@live.kutztown.edu";
		const email2 = "jane.smith@gmail.com";

		console.log(checkEmail(email1)); // true
		console.log(checkEmail(email2)); // false
	});
});