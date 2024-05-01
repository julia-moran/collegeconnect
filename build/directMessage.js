$(document).ready(function() { 
    if (sessionStorage.length == 0) {
         window.location.replace("../");
    } else {
        const socket = io();
        
        const url = new URL(queryString);
        const pathSegments = url.pathname.split('/');
        userID = parseInt(pathSegments[pathSegments.length - 1]);
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
                userName.className = "class-button";
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
            if (results.length === 0 && !(userID)) {
                $("#usersTitle").text("Please Search for Another Student and Send a Message First to Chat with Them.");
            } else {
                $("#usersTitle").text("Messages");
                $(results).each(function(i, result) {
                    if(result.id != userID) {
                        const userName = document.createElement("li");
                        userName.textContent = result.firstname + " " + result.lastname;
                        userName.id = result.id;
                        userName.className = "class-button";
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

            if(fromUserID == sessionStorage.getItem("currentID")) {
                messageInfo.className = "myMessage";
                const username = document.createElement('p')
                username.textContent = result.firstname + " " + result.lastname;
                username.style.margin = "-2px";
                username.style.marginTop = "2px";
                username.style.marginLeft = "2px";
                messageInfo.appendChild(username);
            } else {
                const profileLink = document.createElement('a')
                messageInfo.className = "otherMessage";
                profileLink.textContent = result.firstname + " " + result.lastname;
                profileLink.setAttribute('href', '/viewProfile/' + result.id);
                profileLink.style.margin = "-2px";
                profileLink.style.marginTop = "2px";
                profileLink.style.marginLeft = "2px";
                messageInfo.appendChild(profileLink);
            }
            //messageInfo.textContent = result.firstname + " " + result.lastname + " (" + reformattedTimestamp + "): " ;
            //messages.appendChild(messageInfo);
            //messages.scrollTo(0, messages.scrollHeight)
            const timestamp = document.createElement('p');
            timestamp.textContent = ": (" + reformattedTimestamp + ")";
            timestamp.style.paddingTop = "0px";
            timestamp.style.fontSize = "12px";
            timestamp.style.margin = "2px";
            messageInfo.appendChild(timestamp);
            messageInfo.id = result.chatroomid;
            
            messages.appendChild(messageInfo);
            messages.scrollTo(0, messages.scrollHeight)
            const item = document.createElement('li');
            item.textContent = msg;
            item.style.margin = "3px";
            messageInfo.appendChild(item);
            messages.appendChild(messageInfo);
            messages.scrollTo(0, messages.scrollHeight);
        });
    });
    }
})