/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: forgotPassword.js */
/* Purpose: */
/************************************************************/

//const client = require('../index.js');
$(document).ready(function() {
    
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const enterEmail = document.getElementById('enterEmailForm');
    const enterOtp = document.getElementById('enterOtpForm');
    const newPassword = document.getElementById("newPasswordForm");
    const errorMessage = document.getElementById("errorMessage");
    let otpCode = "";
    let otpAttempts = 0;
    
    $("#newPassword").hide();
    $("#enterOtp").hide();
    $("#successfulAccountCreation").hide();
    $("#popupConfirmation").hide();

    $("#closePopup").click(function() {
        $("#popupConfirmation").hide();
    });

    enterEmail.addEventListener('submit', (e) => {

        e.preventDefault();

        var email = $("#email").val();
        errorMessage.innerHTML = "";
        $.post('/sendForgetPasswordEmail', { email: email },
        function(result, status) {
            //console.log(result, status);
            if(result.data == "Email not found") {
                errorMessage.innerHTML = "Invalid email";
            } else {
                errorMessage.innerHTML = "";
                otpCode = result.data;
                timeSent = result.timeSent;
                $("#enterEmailForm").hide();
                $("#enterOtp").show();
            }

        });

        
    });

    enterOtp.addEventListener('submit', (e) => {
        e.preventDefault();
        otpAttempts++;
        //console.log(otpAttempts);

        let currentTime = new Date().toISOString();
        console.log(timeSent, currentTime, currentTime <= timeSent);
        if(($("#otp").val() == otpCode) && (otpAttempts < 3) && (currentTime <= timeSent)) {
            $("#enterOtp").hide();
            $("#newPassword").show();          
        } else if ($("#otp").val() != otpCode) {
            $("#otpError").text("Incorrect OTP. Please try again.");
        }

        if(currentTime > timeSent) {
            $("#popupConfirmation").show();
            $("#popupMessage").text("OTP code has expired. A new OTP code has been sent.");
            $.post('/sendForgetPasswordEmail', { email: $('#email').val() },
            function(result, status) {
                otpCode = result.data;
                timeSent = result.timeSent;
                otpAttempts = 0;
            });
        }
        if (otpAttempts >= 3) {
            $("#popupConfirmation").show();
            $("#popupMessage").text("Too many incorrect attempts. A new OTP code has been sent.");
            $.post('/sendForgetPasswordEmail', { email: $('#email').val() },
            function(result, status) {
                otpCode = result.data;
                timeSent = result.timeSent;
                otpAttempts = 0;
            });
        }
    });

    $("#sendNewOtp").click(function() {
        $.post('/sendForgetPasswordEmail', { email: $('#email').val() },
        function(result, status) {
            //console.log(result.data, status);
            otpCode = result.data;
            timeSent = result.timeSent;
            otpAttempts = 0;
        });
    });


    newPassword.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(password.value != confirmPassword.value) {
            errorMessage.innerHTML = "Passwords don't match";
        } else if (password.value.length < 7) {
            errorMessage.innerHTML = "Password must be at least seven characters";
        } else if (!(password.value.match(/\d/g))) {
            errorMessage.innerHTML = "Password must contain at least one numeral";
        } else if (!(password.value.match(/[a-zA-Z]/g))){
            errorMessage.innerHTML = "Password must contain at least one letter";
        } else {
            $.post('/updatePassword', {
                email: $("#email").val(),
                password: $("#password").val()
            });
            errorMessage.innerHTML = "";
            $("#newPassword").hide();
            $("#successfulAccountCreation").show();
        }

    });



});