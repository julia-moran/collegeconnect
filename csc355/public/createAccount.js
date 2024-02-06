//const client = require('../index.js');
$(document).ready(function() {
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const signUp = document.getElementById('signUp');
const errorMessage = document.getElementById('errorMessage');
const logInLink = document.getElementById("logInLink");
const addProfileDetails = document.getElementById("addProfileDetails");
const email = document.getElementById('email');
//import * as db from '../db.js'

/*
app.get('/:id', async (req, res, next) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id])
  res.send(result.rows[0])
})
*/

    
    $('.select-multiple').select2();
    $("form.profileDetails").children().hide();
    $("optgroup.profileDetails").children().hide();
    $("optgroup.profileDetails").hide();

    function checkEmail(emailInput) {
        /*$.ajax({
            url: "/get/data",
            method: "GET",
            dataType: "json",
            data: {
                test: "test data"
            },
            success: function(result) {
                $(result).each(function(i, emailResult) {
                    $("#test").text(emailResult.email);
                });
            }
        });*/
        $.get("/get/data", function(result, status) {
            $(result).each(function(i, emailResult) {
                $("#test").text(emailInput);
                $("#test2").text(emailResult.email);
                if(emailResult.email == emailInput) {
                    return true;
                }
            });
            return false;
        });

    }


    signUp.addEventListener('submit', (e) => {

        e.preventDefault();

        //getEmails();
        if(password.value != confirmPassword.value) {
            errorMessage.innerHTML = "Passwords don't match";
        } else if (password.value.length < 7) {
            errorMessage.innerHTML = "Password must be at least seven characters";
        } else if (!(password.value.match(/\d/g))) {
            errorMessage.innerHTML = "Password must contain at least one numeral";
        } else if (!(password.value.match(/[a-zA-Z]/g))){
            errorMessage.innerHTML = "Password must contain at least one letter";
        } else if (!(checkEmail(email.value))) {
            errorMessage.innerHTML = "Invalid email";
        } else {
            //errorMessage.innerHTML = "Account successfully created";
            for(const child of signUp.children) {
                console.log(child.value);
                child.style.display = "none";
            }
            //logInLink.style.display = "block";
            $("form.profileDetails").children().show();
            $("optgroup.profileDetails").children().show();
            $("optgroup.profileDetails").show();
        }

    });

    addProfileDetails.addEventListener('submit', (e) => {

        e.preventDefault();
        logInLink.style.display = "block";
        $("form.profileDetails").children().hide();
        $("optgroup.profileDetails").children().hide();
        $("optgroup.profileDetails").hide();
        $("#successfulAccountCreation").children().show();
    });

});