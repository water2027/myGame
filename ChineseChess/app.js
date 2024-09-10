const express = require("express");
const ws = require("ws");
const http = require("http");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wss = new ws.Server({ noServer: true });

var rooms = [];

app.get("/createRoom", (req, res) => {
    const { user,color } = req.body;
    const room = {
        ws: null,
        id: rooms.length,
        players: [{ user: user, color: color }],
    };
    rooms.push(room);
    res.json(room);
});

app.get("/joinRoom", (req, res) => {
    const { user, color,roomId } = req.body;
    const room = rooms[roomId];
    if (room.players.length == 2) {
        res.json({ message: "Room is full" });
    } else {
        if(room.players[0].color == color){
            res.json({ message: "Color is taken" });
            return;
        }
        room.players.push({ ws:null,user: user, color: color });
        res.json(room);
    }
})

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});





