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
    
    $('.select-multiple').select2();
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const signUp = document.getElementById('signUp');
    const errorMessage = document.getElementById('errorMessage');
    const logInLink = document.getElementById("logInLink");
    const addProfileDetails = document.getElementById("addProfileDetails");
    const confirmEmailForm = document.getElementById("confirmEmailForm");
    let otpCode = "";
    let email = "";
    
    $("#profileDetails").hide();
    $("optgroup.profileDetails").children().hide();
    $("optgroup.profileDetails").hide();
    $("#confirmEmail").hide();

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
                            //console.log(result.data, status);
                            otpCode = result.data;
                        });
                        $("#userDetails").hide();
                        $("#confirmEmail").show();
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
        
        if($("#otp").val() == otpCode) {
            $("#confirmEmail").hide();
            $("#profileDetails").show();
            $("optgroup.profileDetails").children().show();
            $("optgroup.profileDetails").show();            
        } else {
            $("#otpError").text("Incorrect OTP. Please try again.");
        }

    });

    $("#sendNewOtp").click(function() {
        $.post('/sendVerificationEmail', { email: $('#email').val() },
        function(result, status) {
            //console.log(result.data, status);
            otpCode = result.data;
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
            interest1: $("#interest1 option:selected").text(),
            interest2: $("#interest2 option:selected").text(),
            interest3: $("#interest3 option:selected").text()
        });

       // $("#test").text(classes);
        logInLink.style.display = "block";
        $("#profileDetails").hide();
        $("optgroup.profileDetails").children().hide();
        $("optgroup.profileDetails").hide();
        $("#successfulAccountCreation").show();
    });

});