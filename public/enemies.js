

socket.on('amount', (text) => {
    console.log(text);
})
socket.on("joined", () => {
    console.log("My name is kaden and I am going to eat some cheetoes")
});
socket.on("ijoined", () => {
    console.log("only I joined");
})