// Create new socket.io client 
socket = io();

// Get form
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Message from server
socket.on('message', message => {
    //console.log(message);
    outputMessage(message);

    // Scroll down on new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit message
chatForm.addEventListener('submit', (e) => {
    // Prevent submit
    e.preventDefault();

    // Get msg text
    const msg = e.target.elements.msg.value;

    // console.log(msg);
    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${msg.username} <span>${msg.time}</span></p>
            <p class="text">
                ${msg.text}
            </p>
        `;
    document.querySelector('.chat-messages').appendChild(div);
}