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
        sharedClass.textContent = "Shares ";
        interests.textContent = "Likes ";

        $.post('/displayUserInfo', { id: userID },
        function(result, status) {
            //$("#showID").text(result.minor);
            $("#name").text(result.firstname + " " + result.lastname + "'s Profile");
            $("#email").text(result.email);
            $("#major").text("Major: " + result.major);
            $("#minor").text("Minor: " + result.minor);

        });

        $.post('/displayInterests', { id: userID },
        function(interestResults, status) {
            $(interestResults).each(function(i, interestResult) {
                interests.textContent = interests.textContent + interestResult.interest + " ";
                profileDiv.appendChild(interests);
            });
        });

        $.post('/searchForSharedClasses', { id: sessionStorage.getItem("currentID"), searchedUserID: userID },
        function(classResults, status) {
            profileDiv.appendChild(document.createElement('br'));
            $(classResults).each(function(i, classResult) {
                sharedClass.textContent = sharedClass.textContent + classResult.classcode + " ";
                profileDiv.appendChild(sharedClass);
             });
    
        });
    }

})