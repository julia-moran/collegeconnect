//import { Pool, Client } from 'pg';

const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const createAccount = document.getElementById('createAccount');
const errorMessage = document.getElementById('errorMessage');
const inputFields = document.getElementsByTagName('input');
const lastName = document.getElementById('lname');
const passwordTip = document.getElementById('passwordTip');
const createAccountButton = document.getElementById('createAccountButton');
const div = document.getElementById("logInLink");

//import * as db from '../db.js'

/*
app.get('/:id', async (req, res, next) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id])
  res.send(result.rows[0])
})


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "21184",
    database: "postgres"
})
*/


createAccount.addEventListener('submit', (e) => {
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
        errorMessage.innerHTML = "Account successfully created";
        for(let i = 0; i < inputFields.length; i++) {
            console.log(inputFields[i].value);
            inputFields[i].remove();
        }
        password.remove();
        confirmPassword.remove();
        lastName.remove();
        passwordTip.remove();
        createAccountButton.remove();

        const logInLink = document.createElement("a");
        logInLink.appendChild(document.createTextNode("Log In"));
        logInLink.setAttribute("href", "/")
        div.appendChild(logInLink);
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