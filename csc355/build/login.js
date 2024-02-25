document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#loginform');
document.querySelector('#loginform').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!email || !password) {
        alert('Email and password are required');
        return;
    }

    if (!email.includes('@')) {
        alert('Invalid email');
        return;
    }

    if (password.length < 1) {
        alert('Password must be at least 1 character long');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();

        if (data === 'Valid') {
            alert('Login successful!');
            window.location.href = 'home.html';
            } else {
                alert('Login failed. Please check your email and password and try again.');
                location.reload();
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    });
});