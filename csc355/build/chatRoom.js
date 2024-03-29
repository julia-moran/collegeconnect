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
    let chatRoom = "";

    $.post('/displayClasses', { id: sessionStorage.getItem("currentID") },
    function(classResults, status) {
        $(classResults).each(function(i, classResult) {
            const userClass = document.createElement('li');
            userClass.className = "classCodes";
            userClass.textContent = classResult.classcode;
            userClass.id = classResult.classcode;
            $("#userClasses").append(userClass);
            userClass.addEventListener("click", () => {
                chatRoom = userClass.id;
                joinRoom(chatRoom);
            })
            $(".classCodes").hide();
        });
    });

    $.get('/testChatLog');

    $("#classes").click(function() {
        $(".classCodes").toggle();
    });
    
    function joinRoom(classCode) {
        // Remove all messages from view
        while(messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }

        socket.emit('join-room', classCode);

        $(".classCodes").each(function() {
            if(classCode !== $(this).attr("id")) {
                console.log($(this).attr("id"))
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
            console.log(timeSent);
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

})
