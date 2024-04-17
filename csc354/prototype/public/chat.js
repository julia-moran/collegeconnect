/*
    Author:         Julia Moran
    Creation Date:  October 11, 2023
    Course:         CSC354
    Professor Name: Dr. Schwesinger
    Filename:       chat.js
    Description:    Provides the event listeners and functions
                    for interaction on the prototype
*/

/*************************SOURCES CITED***************************************/
/*
  Author:         Socket.io (Github committed by Damien Arrachequesne)
  Filename:       index.js
  Retrieved Date: October 11, 2023
  Retrieved from: https://socket.io/docs/v4/tutorial/introduction
                  https://github.com/socketio/chat-example/blob/main/index.js
  Note:           The methods for initializing the socket and displaying the
                  messages in the html were based on the methods outlined in
                  the Socket.io Getting Started tutorial. The socket.emit()
                  function was retrieved from the Socket.io Getting Started
                  tutorial.
*/

/*Citation Source: this code to initialize the socket was retrieved from
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
const socket = io({
    auth: {
      serverOffset: 0
    }
  });

// Get elements to be used
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const selectUsername = document.getElementById("select-username");
const username = document.getElementById('username');
const groupHeader = document.getElementById('groupHeader');
const classChoices = document.querySelectorAll('.classChoices');
let group = "";

/*
  Function Name:  logIn
  Description:    Displays messages after a user logs in  
*/
function logIn() {
    // Display the messages and groups
    document.querySelectorAll('.messages-and-groups').forEach((messagesAndGroups) => { 
        messagesAndGroups.hidden = false;
    });

    // Remove the log in from view
    selectUsername.hidden = true;
    console.log(username.value);

    // Clear messages from view
    while(messages.firstChild) {
        messages.removeChild(messages.firstChild);
    }
}

// When a group chat option is clicked, display the messages
// in that chat
classChoices.forEach(classChoice => {
    classChoice.addEventListener("click", () => {
        // Set the group value
        group = classChoice.id;
        groupHeader.innerHTML = classChoice.innerHTML;

        // Remove all messages from view
        while(messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }

        // Join the selected class chat
        /*Citation Source: the socket.emit() function was retrieved from
            https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
        socket.emit('join-room', group);

        // Leave all other classes
        classChoices.forEach(choice => {
            if(group !== choice.id) {
                /*Citation Source: the socket.emit() function was retrieved from
                    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
                socket.emit('leave-room', choice.id);
            }
        })
    });
})

// If a message is sent, emit it for all users in the
// selected chat
/*Citation Source: the socket.emit() function was retrieved from
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value, username.value, group);
        input.value = '';
    }
});

// When a message is emitted, display it for all users in the
// selected chat
socket.on('chat message', (msg, user, currentGroup, serverOffset) => {
    /*Citation Source: this method of appending messages to the document was
    based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
    const fromUser = document.createElement('li');
    fromUser.className = currentGroup;
    fromUser.textContent = user + ":";
    messages.appendChild(fromUser);
    messages.scrollTo(0, messages.scrollHeight)
    const item = document.createElement('li');
    item.textContent = msg;
    item.className = currentGroup;
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight)
    socket.auth.serverOffset = serverOffset;
});