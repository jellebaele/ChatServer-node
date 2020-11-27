// Get form
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from url
// https://www.npmjs.com/package/qs:
/**
 * To bypass the leading question mark, use ignoreQueryPrefix:
 *
 *  var prefixed = qs.parse('?a=b&c=d', { ignoreQueryPrefix: true });
 *  assert.deepEqual(prefixed, { a: 'b', c: 'd' });
 */
//console.log(location.search);
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Create new socket.io client 
socket = io();
// Join chatroom when the client is connected
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

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

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}