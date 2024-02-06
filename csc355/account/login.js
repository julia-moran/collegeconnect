document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');
        console.log({
            username: username,
            password: password
        });
    });
});