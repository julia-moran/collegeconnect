/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: chatRoom.js */
/* Purpose: This file defines the JS scripting to handle chat room instances in the application. */
/************************************************************/

$(document).ready(function() {

    const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const threadName = document.getElementById('threadName');
    const threadNameInput = document.getElementById('inputThreadName');
    const threadNames = document.getElementById('threadNames');
    const threadMessages = document.getElementById('threadMessages');
    const threadInput = document.getElementById('inputThreadMessage');
    const threadForm = document.getElementById('threadMessage');
    let chatRoom = "";
    let threadID = "";
    let existingThreadNames = [];

    $("#threadTitle").hide();
    $("#messagesDiv").hide();
    $("#threadsInside").hide();

    $.post('/displayClasses', { id: sessionStorage.getItem("currentID") },
    function(classResults, status) {
        $(classResults).each(function(i, classResult) {
            const userClass = document.createElement('li');
            userClass.className = "classCodes class-button"; // Add the class-button class
            userClass.textContent = classResult.classcode;
            userClass.id = classResult.classcode;
            $("#userClasses").append(userClass);
            userClass.addEventListener("click", () => {
                $("#messagesDiv").show();
                while(threadMessages.firstChild) {
                    threadMessages.removeChild(threadMessages.firstChild);
                }
                chatRoom = userClass.id;
                joinRoom(chatRoom);
                showThreadNames(chatRoom);
            });
            $(".classCodes").show(); // Show the classes
        });
    });

    //$.get('/testChatLog');

    $("#classes").click(function() {
        $(".classCodes").toggle();

    });
    $("#threadMessage").hide();

    $("#threadTitle").click(function() {
        $("#threadsInside").toggle();

    });

    function showThreadNames(chatRoom) {
        $("#threadTitle").show();
        existingThreadNames = [];
        $("#errorMessage").text("");
        while(threadNames.firstChild) {
            threadNames.removeChild(threadNames.firstChild);
        }        
        $.post('/getThreads', { classCode: chatRoom },
        function(results, status) {
            $(results).each(function(i, result) {
                //console.log(result);
                const threadName = document.createElement("li");
                threadName.textContent = result.threadid;
                threadName.id = result.threadid;

                $("#threadNames").append(threadName);
                existingThreadNames.push(result.threadid);   
                threadName.addEventListener("click", (e) => {
                    if(e.target === e.currentTarget) {
                        while(threadMessages.firstChild) {
                            threadMessages.removeChild(threadMessages.firstChild);
                        }
                        threadID = result.threadid;
                        console.log("Join");
                        $("#threadMessage").show();
                        socket.emit('joinThreadChat', chatRoom, result.threadid);
                    }
                });
                
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "X";
                deleteButton.setAttribute("type", "button");
                deleteButton.id = "deleteButton";
                threadName.appendChild(deleteButton);
                deleteButton.addEventListener("click", () => {
                    while(threadMessages.firstChild) {
                            threadMessages.removeChild(threadMessages.firstChild);
                    }
                    $.post('/deleteThread', { classCode: chatRoom, threadID: result.threadid },
                    function(result, status) {
                        threadNames.removeChild(threadName);
                    });
                });            
            });
        });
    }
    
    function joinRoom(classCode) {
        // Remove all messages from view
        while(messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }
        $("#chatroomTitle").text(classCode);
        socket.emit('join-room', classCode);

        $(".classCodes").each(function() {
            if(classCode !== $(this).attr("id")) {
                //console.log($(this).attr("id"))
                socket.emit('leave-room', $(this).attr("id")) 
            }
            
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value && chatRoom) {
            let timeSent = new Date().toISOString();
            timeSent = timeSent.replace('T', ' ');
            timeSent = timeSent.substring(0, timeSent.length - 5)
            //console.log(timeSent);
            socket.emit('chat message', chatRoom, sessionStorage.getItem("currentID"), input.value, timeSent);
            input.value = '';
        }
    });

    socket.on('chat message', (classCode, userID, msg, timeSent) => {
        $.post('/displayUserInfo', { id: userID },
        function(result, status) {
            const messageInfo = document.createElement('li');
            messageInfo.style.listStyleType = "none";
            messageInfo.className = classCode;

            if(result.id == sessionStorage.getItem("currentID")) {
                const username = document.createElement('p')
                username.textContent = result.firstname + " " + result.lastname;
                username.style.display = "inline-block";
                username.style.margin = "-5px";
                messageInfo.appendChild(username);
            } else {
                const profileLink = document.createElement('a')
                profileLink.textContent = result.firstname + " " + result.lastname;
                profileLink.setAttribute('href', '/viewProfile/' + result.id);
                profileLink.style.display = "inline-block";
                messageInfo.appendChild(profileLink);
            }
            const timestamp = document.createElement('p');
            let reformattedTimestamp = timeSent.replace("T", " ");
            reformattedTimestamp = reformattedTimestamp.split(".")[0];
            timestamp.textContent = ": (" + reformattedTimestamp + ")";
            timestamp.style.display = "inline-block";
            messageInfo.appendChild(timestamp);
            messages.appendChild(messageInfo);
            messages.scrollTo(0, messages.scrollHeight)
            const item = document.createElement('li');
            item.style.listStyleType = "none";
            item.textContent = msg;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    });

    threadName.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (threadNameInput.value && !(existingThreadNames.includes(threadNameInput.value))) {
            $("#errorMessage").text("");
            let timeSent = new Date().toISOString();
            timeSent = timeSent.replace('T', ' ');
            timeSent = timeSent.substring(0, timeSent.length - 5)
            //console.log(timeSent);
            socket.emit('thread message', chatRoom, sessionStorage.getItem("currentID"), "Created a thread.", timeSent, threadNameInput.value);
            threadNameInput.value = '';
            while(threadMessages.firstChild) {
                threadMessages.removeChild(threadMessages.firstChild);
            }
            showThreadNames(chatRoom);
        } else {
            $("#errorMessage").text("Thread Name already exists");
        }
    });

    threadForm.addEventListener('submit', (e) => {
        e.preventDefault();console.log(threadNameInput.value);
        if (threadInput.value && threadID) {
            let timeSent = new Date().toISOString();
            timeSent = timeSent.replace('T', ' ');
            timeSent = timeSent.substring(0, timeSent.length - 5)
            console.log(timeSent);
            socket.emit('thread message', chatRoom, sessionStorage.getItem("currentID"), threadInput.value, timeSent, threadID);
            threadInput.value = '';
        }
    });

    socket.on('thread message', (classCode, userID, msg, timeSent, threadID) => {
        $.post('/displayUserInfo', { id: userID },
        function(result, status) {
            const messageInfo = document.createElement('li');
            if(result.id == sessionStorage.getItem("currentID")) {
                messageInfo.className = "myThreadMessage";
                const username = document.createElement('p')
                username.textContent = result.firstname + " " + result.lastname;
                username.style.margin = "-2px";
                username.style.marginTop = "2px";
                username.style.marginLeft = "2px";
                messageInfo.appendChild(username);
            } else {
                const profileLink = document.createElement('a')
                messageInfo.className = "otherThreadMessage";
                profileLink.textContent = result.firstname + " " + result.lastname;
                profileLink.setAttribute('href', '/viewProfile/' + result.id);
                profileLink.style.margin = "-2px";
                profileLink.style.marginTop = "2px";
                profileLink.style.marginLeft = "2px";
                messageInfo.appendChild(profileLink);
            }
            const timestamp = document.createElement('p');
            let reformattedTimestamp = timeSent.replace("T", " ");
            reformattedTimestamp = reformattedTimestamp.split(".")[0];
            timestamp.textContent = ": (" + reformattedTimestamp + ")";
            timestamp.style.paddingTop = "0px";
            timestamp.style.fontSize = "12px";
            timestamp.style.margin = "2px";
            messageInfo.appendChild(timestamp);
            messageInfo.id = threadID;
            
            threadMessages.appendChild(messageInfo);
            threadMessages.scrollTo(0, threadMessages.scrollHeight)
            const item = document.createElement('li');
            item.textContent = msg;
            item.style.margin = "3px";
            messageInfo.appendChild(item);
            threadMessages.appendChild(messageInfo);
            threadMessages.scrollTo(0, threadMessages.scrollHeight);
        });
    });

})
