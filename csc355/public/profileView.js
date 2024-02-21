$(document).ready(function() {

   // $("#showID").text(sessionStorage.getItem("currentID"));

    let currentMajor = $("#selectMajor option:selected").text();
    $('.select-multiple').select2();

    $.post('/post/userInfo', { id: sessionStorage.getItem("currentID") },
        function(result, status) {
            //$("#showID").text(result.minor);
            $("#name").text(result.first_name + " " + result.last_name + "'s Profile");
            $("#selectMajor option[value='" + result.major + "']").attr("selected","selected");
            //if(result.minor != NULL) {
            $("#selectMinor option[value='" + result.minor + "']").attr("selected","selected");
            //} else {
            //    $("#selectMinor option[text='None']").attr("selected","selected");$
            //}
        });

    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
    
        $.post('/update/profileInfo', {
            id: sessionStorage.getItem("currentID"),
            major: $("#selectMajor option:selected").text(),
            minor: $("#selectMinor option:selected").text()
        });
    });

})