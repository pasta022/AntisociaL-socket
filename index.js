const io = require("socket.io")(8800, {
    cors: {
        origin: "http://localhost/3000"
    }
});

io.on("connection", (socket) => {
    console.log("a user has connected");
});