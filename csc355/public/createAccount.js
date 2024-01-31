//import { Pool, Client } from 'pg';

const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const createAccount = document.getElementById('createAccount');
const errorMessage = document.getElementById('errorMessage');
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
        location.replace("/");
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