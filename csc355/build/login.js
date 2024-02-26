document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Invalid credentials. Please check your email and password and try again.');
            } else {
                alert('An error occurred. Please try again later.');
            }
            location.reload();
            return;
        }

        const data = await response.json();

        if (data.message === 'Login successful!') {
            alert('Login successful! You will be redirected to the homepage.');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});