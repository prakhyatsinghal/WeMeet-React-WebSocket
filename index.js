const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");    //allows cross-origin requests between different domains

const io = require("socket.io")(server, {
	cors: {
		origin: "*",   //allows access from all origins
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());  //CORS middleware to enable cross-origin requests in the Express app


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running! Now you can use the UI of the App');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));