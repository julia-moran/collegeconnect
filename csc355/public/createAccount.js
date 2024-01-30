const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const createAccount = document.getElementById('createAccount');
const errorMessage = document.getElementById('errorMessage');



createAccount.addEventListener('submit', (e) => {
    e.preventDefault();
    if(password.value != confirmPassword.value) {
        errorMessage.innerHTML = "Passwords don't match";
    } else if (password.value.length < 7) {
        errorMessage.innerHTML = "Password must be at least seven characters";
    } else if (!(password.value.match(/\d/g))) {
        errorMessage.innerHTML = "Password must contain at least one numeral";
    } else {
        location.replace("/");
    }
});