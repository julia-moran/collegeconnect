document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const profile = document.querySelector('#profile').value;
        const classes = document.querySelector('#classes').value;
        const interests = document.querySelector('#interests').value;

        console.log(`Profile: ${profile}`);
        console.log(`Classes: ${classes}`);
        console.log(`Interests: ${interests}`);
    });
});