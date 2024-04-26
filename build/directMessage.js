$(document).ready(function() { 
    if (sessionStorage.length == 0) {
         window.location.replace("../");
    } else {
        const socket = io();
        const queryString = window.location.href;
        let userID = parseInt(queryString.substring(36));
        console.log(userID);
        let toUserID = userID;

        const form = document.getElementById('form');
        const input = document.getElementById('input');
        const messages = document.getElementById('messages');

        $("#form").hide();

        if(userID) {
            $.post('/displayUserInfo', { id: userID },
            function(result, status) {
                const userName = document.createElement("li");
                userName.textContent = result.firstname + " " + result.lastname;
                userName.id = result.id;
                $("#usersWithChatHistory").append(userName);
                userName.addEventListener("click", () => {
                    $("#form").show();
                    toUserID = userName.id;
                    console.log(toUserID);
                    joinPrivateMessage(toUserID);
                    //$.get('/testChatLog');
                });
            });            
        }


        $.post('/getUsersWithChatHistory', { id: sessionStorage.getItem("currentID") },
        function(results, status) {
            if (results.length === 0) {
                $("#usersTitle").text("Search for a student to chat with them");
            } else {
                $("#usersTitle").text("Messages");
                $(results).each(function(i, result) {
                    if(result.id != userID) {
                        const userName = document.createElement("li");
                        userName.textContent = result.firstname + " " + result.lastname;
                        userName.id = result.id;
                        $("#usersWithChatHistory").append(userName);
                        userName.addEventListener("click", () => {
                            $("#form").show();
                            toUserID = userName.id;
                            console.log(toUserID);
                            joinPrivateMessage(toUserID);
                            //$.get('/testChatLog');
                        });                    
                    }
                });                
            }

        });

        //$.get('/testChatLog');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value && toUserID) {
                let timeSent = new Date().toLocaleString("en-US", { timeZone: "America/New_York"});
                //console.log(timeSent);
                socket.emit('direct message', toUserID, sessionStorage.getItem("currentID"), input.value, timeSent);
                input.value = '';
            }
        });

            
    function joinPrivateMessage(toUserID) {
        // Remove all messages from view
        while(messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }
        console.log("Join Private Chat");
        socket.emit('joinPrivateChat', toUserID, sessionStorage.getItem("currentID"));
    }

    socket.on('direct message', (toUserID, fromUserID, msg, timeSent) => {
        //$("#test").text("HIT");
        $.post('/displayUserInfo', { id: fromUserID },
        function(result, status) {
            //console.log(result);
            //console.log(msg);
            let reformattedTimestamp = timeSent.replace("T", " ");
            reformattedTimestamp = reformattedTimestamp.split(".")[0];
            const messageInfo = document.createElement('li');
            messageInfo.className = toUserID;
            messageInfo.textContent = result.firstname + " " + result.lastname + " (" + reformattedTimestamp + "): " ;
            messages.appendChild(messageInfo);
            messages.scrollTo(0, messages.scrollHeight)
            const item = document.createElement('li');
            item.textContent = msg;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    });
    }
})