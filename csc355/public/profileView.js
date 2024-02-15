$(document).ready(function() {

   // $("#showID").text(sessionStorage.getItem("currentID"));
/*
    $.get("/get/userInfo", function(results, status) {
        $(results).each(function(i, result) {

            if(emailResult.email == email.value) {
                errorMessage.innerHTML = "";
                for(const child of signUp.children) {
                    child.style.display = "none";
                }

        });
    });*/
    let currentMajor = $("#selectMajor option:selected").text();

    $.post('/post/userInfo', { id: sessionStorage.getItem("currentID") },
        function(result, status) {
            $("#name").text(result.first_name + " " + result.last_name + "'s Profile");
            $("select option[value='" + result.major + "']").attr("selected","selected");
        });

    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const profile = document.querySelector('#profile').value;
        const classes = document.querySelector('#classes').value;
        const interests = document.querySelector('#interests').value;

        console.log(`Profile: ${profile}`);
        console.log(`Classes: ${classes}`);
        console.log(`Interests: ${interests}`);

        $.post('/update/profileInfo',
            { id: sessionStorage.getItem("currentID"),
                major: $("#selectMajor option:selected").text()});
    });

})