/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: login.js */
/* Purpose: */
/************************************************************/

$(document).ready(function() {
    $("#forgotPasswordButton").click(function() {
        $.post('/sendForgetPasswordEmail', { email: $('#email').val() },
        function(result, status) {
            console.log(result, status)
        });

    });    

    $("#popupConfirmation").hide();

    $("#closePopup").click(function() {
        $("#popupConfirmation").hide();
    });

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
                    sessionStorage.setItem("currentID", data.id);
                    sessionStorage.setItem("clearance", data.clearance);
                    window.location.replace("../main");
                }
            },
            error: function(jqXHR) {
                if (jqXHR.status === 400) {
                    $("#popupConfirmation").show();
                } else {
                    alert('An error occurred. Please try again later.');
                    location.reload();
                }
            }
        });
    });
});