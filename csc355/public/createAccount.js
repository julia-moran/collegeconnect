//const client = require('../index.js');
$(document).ready(function() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const signUp = document.getElementById('signUp');
    const errorMessage = document.getElementById('errorMessage');
    const logInLink = document.getElementById("logInLink");
    const addProfileDetails = document.getElementById("addProfileDetails");
    const email = document.getElementById('email');

    
    $('.select-multiple').select2();
    $("form.profileDetails").children().hide();
    $("optgroup.profileDetails").children().hide();
    $("optgroup.profileDetails").hide();



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
            $.get("/get/emails", function(emailResults, status) {
                $(emailResults).each(function(i, emailResult) {
                    //$("#test").text(email.value);
                    //$("#test2").text(emailResult.email);
                    if(emailResult.email == email.value) {
                        errorMessage.innerHTML = "";
                        for(const child of signUp.children) {
                            child.style.display = "none";
                        }
                        $("form.profileDetails").children().show();
                        $("optgroup.profileDetails").children().show();
                        $("optgroup.profileDetails").show();
                    } else {
                        errorMessage.innerHTML = "Invalid email";
                    }
                });
            });
            
        }

    });

    addProfileDetails.addEventListener('submit', (e) => {
        e.preventDefault();

        $.post('/post/account', {
            first_name:  $("#fname").val(),
            last_name: $("#lname").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            major: $("#selectMajor option:selected").text()});
        /*$.ajax({
            url: "/post/account",
            data: JSON.stringify(request),
            method: "POST",
            //dataType: "json",
            contentType: "application/json",
            type: "json",
            //processData: true,
            success: function(data) {
               //;
               // 
               // $("#password").val();
               // $("#email").val();
                console.log(data);
            }
            
        });*/
        logInLink.style.display = "block";
        $("form.profileDetails").children().hide();
        $("optgroup.profileDetails").children().hide();
        $("optgroup.profileDetails").hide();
        $("#successfulAccountCreation").children().show();
    });

});