const socket = io({
    auth: {
      serverOffset: 0
    }
  });

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const selectUsername = document.getElementById("select-username");
const username = document.getElementById('username');
const groupHeader = document.getElementById('groupHeader');
let group = "";

function logIn() {
    document.querySelectorAll('.messages-and-groups').forEach((messagesAndGroups) => { 
        messagesAndGroups.hidden = false;
    });

    selectUsername.hidden = true;
    console.log(username.value);

    while(messages.firstChild) {
        messages.removeChild(messages.firstChild);
    }
}

const classChoices = document.querySelectorAll('.classChoices');
classChoices.forEach(classChoice => {
    classChoice.addEventListener("click", () => {
        group = classChoice.id;
        groupHeader.innerHTML = classChoice.innerHTML;
        // Remove all messages from view
        while(messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }
        // Join the selected class chat
        socket.emit('join-room', group);

        // Leave all other classes
        classChoices.forEach(choice => {
            if(group !== choice.id) {
                socket.emit('leave-room', choice.id);
            }
        })
    });
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value, username.value, group);
        input.value = '';
    }
});

socket.on('chat message', (msg, user, currentGroup, serverOffset) => {
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