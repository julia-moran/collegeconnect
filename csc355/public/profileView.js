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

    $.post('/post/interests', { id: sessionStorage.getItem("currentID") },
        function(interestResults, status) {
            $(interestResults).each(function(i, interestResult) {
                if(interestResult.interest != "") {
                    $("#interest" + interestResult.prompt + " option[value= '" + interestResult.interest + "']").attr("selected", "selected");
                } else {
                    $("#interest" + interestResult.prompt + " option[value= '']").attr("selected", "selected");
                }
                
            });
        });

    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
    
        $.post('/update/profileInfo', {
            id: sessionStorage.getItem("currentID"),
            major: $("#selectMajor option:selected").text(),
            minor: $("#selectMinor option:selected").text()
        });

        $.post('/update/interests', {
            id: sessionStorage.getItem("currentID"),
            interest1: $("#interest1 option:selected").text(),
            interest2: $("#interest2 option:selected").text(),
            interest3: $("#interest3 option:selected").text()
        });

    });

})