//const client = require('../index.js');
$(document).ready(function() {
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const signUp = document.getElementById('signUp');
const errorMessage = document.getElementById('errorMessage');
const logInLink = document.getElementById("logInLink");
const addProfileDetails = document.getElementById("addProfileDetails");
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
    



    signUp.addEventListener('submit', (e) => {

        e.preventDefault();
        $.get("/get/data", function(data, status) {
            console.log(data);
        });
        
    /*
        //client.connect((err) => {
            //if (err) throw err;
    
            client.query('SELECT * FROM users', (err, res) => {
            console.log(err ? err : res.rows)
            //client.end()
            })
        //});

        client.connect();

        client.query('SELECT * FROM users', (err, res) => {
        console.log(err ? err : res.rows)
        //client.end()
        client.end();
        })*/

        if(password.value != confirmPassword.value) {
            errorMessage.innerHTML = "Passwords don't match";
        } else if (password.value.length < 7) {
            errorMessage.innerHTML = "Password must be at least seven characters";
        } else if (!(password.value.match(/\d/g))) {
            errorMessage.innerHTML = "Password must contain at least one numeral";
        } else if (!(password.value.match(/[a-zA-Z]/g))){
            errorMessage.innerHTML = "Password must contain at least one letter";
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

        /*client.connect((err) => {
            if (err) throw err;
    
            client.query('SELECT * FROM users', (err, res) => {
            console.log(err ? err.stack : res.rows)
            client.end()
            })
        });
    */
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