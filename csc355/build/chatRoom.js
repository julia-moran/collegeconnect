$(document).ready(function() {

    const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    var classChoices;

    $.post('/displayClasses', { id: sessionStorage.getItem("currentID") },
    function(classResults, status) {
        $(classResults).each(function(i, classResult) {
            const userClass = document.createElement('li');
            userClass.className = "classCodes";
            userClass.textContent = classResult.classcode;
            userClass.id = classResult.classcode;
            $("#userClasses").append(userClass);
            userClass.addEventListener("click", () => {
                joinRoom(userClass.id);
            })
            $(".classCodes").hide();
        });
    });

    $("#classes").click(function() {
        $(".classCodes").toggle();
    });
    
    function joinRoom(classCode) {
        socket.emit('join-room', classCode);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });

    socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

})
