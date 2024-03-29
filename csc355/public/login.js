$(document).ready(function() {

    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        $.post('/post/login', {
            email: email,
            password: password},
            function(result, status) {
                if(result == "Invalid") {
                    document.getElementById("message").innerHTML = "Invalid login";
                } else {
                    sessionStorage.setItem("currentID", result);
                    document.getElementById("message").innerHTML = sessionStorage.getItem("currentID");
                    window.location.replace("../profile-view");
                }
            });
    });

});