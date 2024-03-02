//const client = require('../index.js');
$(document).ready(function() {
    
    $('.select-multiple').select2();
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const signUp = document.getElementById('signUp');
    const errorMessage = document.getElementById('errorMessage');
    const logInLink = document.getElementById("logInLink");
    const addProfileDetails = document.getElementById("addProfileDetails");
   

    
    $("form.profileDetails").children().hide();
    $("optgroup.profileDetails").children().hide();
    $("optgroup.profileDetails").hide();

    $.get("/getClasses", function(classResults, status) {
        $(classResults).each(function(i, classResult) {
            $("#CSCCourses").append("<option value= '" + classResult.classcode + "'>" + classResult.classcode + ": " + classResult.classname + "</option>")
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
                        errorMessage.innerHTML = data.id;
                        sessionStorage.setItem("currentID", data.id);
                        for(const child of signUp.children) {
                            child.style.display = "none";
                        }
                        $("form.profileDetails").children().show();
                        $("optgroup.profileDetails").children().show();
                        $("optgroup.profileDetails").show();
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

    addProfileDetails.addEventListener('submit', (e) => {

        e.preventDefault();
        let classes = $("#selectClasses").val();

        $.post('/addAccount', {
            id: sessionStorage.getItem("currentID"),
            email: $("#email").val(),
            password: $("#password").val(),
            major: $("#selectMajor option:selected").text(),
            minor: $("#selectMinor option:selected").text(),
            interest1: $("#interest1 option:selected").text(),
            interest2: $("#interest2 option:selected").text(),
            interest3: $("#interest3 option:selected").text()
        });
/*
        $.post('/post/classlist', {
            email: $("#email").val(),
            classCodes: classes
        });*/
/*
        $("#test").text(classes);
        logInLink.style.display = "block";
        $("form.profileDetails").children().hide();
        $("optgroup.profileDetails").children().hide();
        $("optgroup.profileDetails").hide();
        $("#successfulAccountCreation").children().show();*/
    });

});