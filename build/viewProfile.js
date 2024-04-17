$(document).ready(function() {

 
    if (sessionStorage.length == 0) {
         window.location.replace("../");
    } else {
        const queryString = window.location.href;
        userID = parseInt(queryString.substring(34));
        console.log(userID);
        const profileDiv = document.getElementById('profileInfo');
        const sharedClass = document.createElement('td');
        const interests = document.createElement('td');

        $("#directMessageLink").attr("href", "/directMessage/" + userID);

        $.post('/displayUserInfo', { id: userID },
        function(result, status) {
            //$("#showID").text(result.minor);
            $("#name").text(result.firstname + " " + result.lastname + "'s Profile");
            $("#email").text(result.email);
            $("#email").attr("href", "mailto:" + result.email);
            $("#major").text("Major: " + result.major);
            $("#minor").text("Minor: " + result.minor);

        });

        $.post('/displayInterests', { id: userID },
        function(interestResults, status) {
            $(interestResults).each(function(i, interestResult) {
                if(interestResult.interest != "") {
                    interests.textContent = interests.textContent + interestResult.interest + " ";
                    profileDiv.appendChild(interests);
                }
            });
            if(interests.textContent !== "") {
                interests.textContent = "Likes " + interests.textContent;
            } else {
                interests.textContent = "No interests";
            }
        });

        $.post('/searchForSharedClasses', { id: sessionStorage.getItem("currentID"), searchedUserID: userID },
        function(classResults, status) {
            if(classResults.length !== 0) {
                sharedClass.textContent = "Shares ";
                profileDiv.appendChild(document.createElement('br'));
                $(classResults).each(function(i, classResult) {
                    sharedClass.textContent = sharedClass.textContent + classResult.classcode + " ";
                    profileDiv.appendChild(sharedClass);
                });
            }
        });
    }

})