$(document).ready(function() {

 
    if (sessionStorage.length == 0) {
         window.location.replace("../");
    } else {
        const queryString = window.location.href;
        const socket = io();
        userID = parseInt(queryString.substring(34));
        console.log(userID);
        const profileDiv = document.getElementById('profileInfo');
        const sharedClass = document.createElement('td');
        const interests = document.createElement('td');
        const reportUserForm = document.getElementById('reportUserForm');
        const reportInput = document.getElementById('reportReason');

        $("#directMessageLink").attr("href", "/directMessage/" + userID);
        $("#reportUserForm").hide();
        $("#reportUserButton").click(function() {
            $("#reportUserForm").toggle();
        });

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

        reportUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (reportInput.value) {
                let timeSent = new Date().toISOString();
                timeSent = timeSent.replace('T', ' ');
                timeSent = timeSent.substring(0, timeSent.length - 5)
                let reportedMessage = "Report Message: " + reportInput.value;
                $.get("/getAdmins", function(adminResults, status) {
                    $(adminResults).each(function(i, adminResult) {
                        socket.emit('direct message', adminResult.id, sessionStorage.getItem("currentID"), reportedMessage, timeSent);
                    })
                });
                
                reportInput.value = '';
                $("#reportUserForm").hide();
            }
        });
    }

})