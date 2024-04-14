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

    $("#threads").hide();

    $.post('/displayClasses', { id: sessionStorage.getItem("currentID") },
    function(classResults, status) {
        $(classResults).each(function(i, classResult) {
            const userClass = document.createElement('li');
            userClass.className = "classCodes class-button"; // Add the class-button class
            userClass.textContent = classResult.classcode;
            userClass.id = classResult.classcode;
            $("#userClasses").append(userClass);
            userClass.addEventListener("click", () => {
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

    function showThreadNames(chatRoom) {
        $("#threads").show();
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
                threadName.addEventListener("click", () => {
                    while(threadMessages.firstChild) {
                        threadMessages.removeChild(threadMessages.firstChild);
                    }
                    threadID = result.threadid;
                    socket.emit('joinThreadChat', chatRoom, result.threadid);
                });            
            });
        });
    }
    
    function joinRoom(classCode) {
        // Remove all messages from view
        while(messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }

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
            messageInfo.className = classCode;
            messageInfo.textContent = result.firstname + " " + result.lastname + ": (" + timeSent + ")" ;
            messages.appendChild(messageInfo);
            messages.scrollTo(0, messages.scrollHeight)
            const item = document.createElement('li');
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
            messageInfo.textContent = result.firstname + " " + result.lastname + ": (" + timeSent + ")" ;
            messageInfo.id = threadID;
            threadMessages.appendChild(messageInfo);
            threadMessages.scrollTo(0, threadMessages.scrollHeight)
            const item = document.createElement('li');
            item.textContent = msg;
            threadMessages.appendChild(item);
            //window.scrollTo(0, document.body.scrollHeight);
        });
    });

})
