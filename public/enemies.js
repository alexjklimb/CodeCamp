const socket = io();

socket.on('amount', (text) => {
    console.log(text);
})