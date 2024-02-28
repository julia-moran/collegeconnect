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
        
                    var userId = data.id;
                    alert('Login successful! You will be redirected to the homepage. User ID: ' + userId);
        
                    window.location.href = '/';
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