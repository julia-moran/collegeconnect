/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: createAccount.js */
/* Purpose: */
/************************************************************/

//const client = require('../index.js');
$(document).ready(function() {
    $('.profile-select').on('select2:open', function (e) {
        $('.select2-container--open .select2-selection--single, .select2-container--open .select2-selection--multiple').css('background-color', '#fffda2');
    });

    $('.profile-select').on('select2:close', function (e) {
        $('.select2-selection--single, .select2-selection--multiple').css('background-color', '');
    });

    $('.select-multiple').select2();
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const signUp = document.getElementById('signUp');
    const errorMessage = document.getElementById('errorMessage');
    const logInLink = document.getElementById("logInLink");
    const addProfileDetails = document.getElementById("addProfileDetails");
    const confirmEmailForm = document.getElementById("confirmEmailForm");
    let otpCode = "";
    let timeSent = "";
    let email = "";
    let otpAttempts = 0;
    
    // Initially hide all forms except the first one
    $("#signUp").show();
    $("#confirmEmailForm").hide();
    $("#addProfileDetails").hide();

    $("#popupConfirmation").hide();

    $("#closePopup").click(function() {
        $("#popupConfirmation").hide();
    });
    
/*
    // When the sign up form is submitted, hide it and show the confirm email form
    $("#signUp").on('submit', function(e) {
        e.preventDefault();
        $(this).hide();
        $("#confirmEmailForm").show();
    });

    // When the confirm email form is submitted, hide it and show the add profile details form
    $("#confirmEmailForm").on('submit', function(e) {
        e.preventDefault();
        $(this).hide();
        $("#addProfileDetails").show();
    });*/

    $.get("/getClasses", function(classResults, status) {
        $(classResults).each(function(i, classResult) {
            $("#CSCCourses").append("<option value= '" + classResult.classcode + "'>" + classResult.classcode + ": " + classResult.classname + "</option>")
        })
    });

    $.get("/getMajors", function(majorResults, status) {
        $(majorResults).each(function(i, majorResult) {
            $("#selectMajor").append("<option value= '" + majorResult.major + "'>" + majorResult.major + "</option>")
        })
    });

    $.get("/getMinors", function(minorResults, status) {
        $(minorResults).each(function(i, minorResult) {
            $("#selectMinor").append("<option value= '" + minorResult.minor + "'>" + minorResult.minor + "</option>")
        })
    });

    $.get("/getInterests", function(interestResults, status) {
        $(interestResults).each(function(i, interestResult) {
            $("#interest1").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>")
            $("#interest2").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>")
            $("#interest3").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>")
        })
    });

    let classes = $("#selectClasses").select2('data');
    $("#test").text(classes);


    signUp.addEventListener('submit', (e) => {
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
            var email = $("#email").val();
            $.ajax({
                url: '/compareEmail',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({email: email}),
                success: function(data) {
                    
                    if(data.message === "Email found") {
                        email = $('#email').val();
                        errorMessage.innerHTML = "";
                        sessionStorage.setItem("currentID", data.id);
                        $.post('/sendVerificationEmail', { email: $('#email').val() },
                        function(result, status) {
                            //console.log(result.timeSent, status);
                            otpCode = result.data;
                            timeSent = result.timeSent;
                        });
                        $("#signUp").hide();
                        $("#userDetails").hide();
                        $("#confirmEmailForm").show();
                    } else {
                        errorMessage.innerHTML = "Invalid email";
                    }
                },
                error: function(jqXHR) {
                    if (jqXHR.status === 401) {
                        errorMessage.innerHTML = "Invalid email";
                    } else {
                        alert('An error occurred. Please try again later.');
                        location.reload();
                    }
                }
            })
        }

    });

    confirmEmailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        otpAttempts++;

        let currentTime = new Date().toISOString();

        if(($("#otp").val() == otpCode) && (otpAttempts < 3) && (currentTime <= timeSent)) {
            $("#confirmEmailForm").hide();
            $("#addProfileDetails").show();
            $("optgroup.profileDetails").children().show();
            $("optgroup.profileDetails").show();            
        } else if ($("#otp").val() != otpCode) {
            $("#otpError").text("Incorrect OTP. Please try again.");
        }

        if(currentTime > timeSent) {
            $("#popupConfirmation").show();
            $("#popupMessage").text("OTP code has expired. A new OTP code has been sent.");
            $.post('/sendVerificationEmail', { email: $('#email').val() },
            function(result, status) {
                otpCode = result.data;
                timeSent = result.timeSent;
                otpAttempts = 0;
            });
        }
        if (otpAttempts >= 3) {
            $("#popupConfirmation").show();
            $("#popupMessage").text("Too many incorrect attempts. A new OTP code has been sent.");
            $.post('/sendVerificationEmail', { email: $('#email').val() },
            function(result, status) {
                otpCode = result.data;
                timeSent = result.timeSent;
                otpAttempts = 0;
            });
        }

    });

    $("#sendNewOtp").click(function() {
        $.post('/sendVerificationEmail', { email: $('#email').val() },
        function(result, status) {
            console.log(result.data, status);
            otpCode = result.data;
            timeSent = result.timeSent;
        });
    });

    addProfileDetails.addEventListener('submit', (e) => {

        e.preventDefault();
        let classes = $("#selectClasses").val();
        if($("#selectMinor option:selected").text() == "") {
            selectedMinor = "None";
        } else {
            selectedMinor = $("#selectMinor option:selected").text();
        }

        if($("#interest1 option:selected").text() == "") {
            interest1 = "None";
        } else {
            interest1 = $("#interest1 option:selected").text();
        }

        if($("#interest2 option:selected").text() == "") {
            interest2 = "None";
        } else {
            interest2 = $("#interest2 option:selected").text();
        }

        if($("#interest3 option:selected").text() == "") {
            interest3 = "None";
        } else {
            interest3 = $("#interest3 option:selected").text();
        }
    
        $.post('/addAccount', {
            email: $("#email").val(),
            password: $("#password").val(),
            major: $("#selectMajor option:selected").text(),
            minor: selectedMinor
        });
    
        $.post('/addClasses', {
            email: $("#email").val(),
            classCodes: classes,
            id: sessionStorage.getItem("currentID")
        });
    
        $.post('/addInterests', {
            id: sessionStorage.getItem("currentID"),
            interest1: interest1,
            interest2: interest2,
            interest3: interest3
        });
    
        logInLink.style.display = "block";
        $("#profileDetails").hide();
        $("optgroup.profileDetails").children().hide();
        $("optgroup.profileDetails").hide();
        $("#successfulAccountCreation").show();
    
        // Redirect to /login route
        setTimeout(() => {
            window.location.replace("/login");
        }, 20);
    });

});