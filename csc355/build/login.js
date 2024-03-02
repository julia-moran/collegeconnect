$(document).ready(function() {

    $('#login-form').on('submit', function(event) {
        event.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();

        $.ajax({
            url: '/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function(data) {
                if (data.message === 'Login successful!') {
// save userID and print (testing purposes only, will be removed later)
                    sessionStorage.setItem("currentID", data.id);
                    alert('Login successful! You will be redirected to the homepage. User ID: ' + sessionStorage.getItem("currentID"));
        
                    window.location.replace("../profile-view");
                }
            },
            error: function(jqXHR) {
                if (jqXHR.status === 401) {
                    alert('Invalid credentials. Please check your email and password and try again.');
                } else {
                    alert('An error occurred. Please try again later.');
                }
                location.reload();
            }
        });
    });
});