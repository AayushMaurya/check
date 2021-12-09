const express = require("express");
var app = express();
const path = require("path");
var http = require('http').Server(app);
const port = process.env.PORT || 3000;

var io = require('socket.io')(http);

// const http = require("http");
// const websocketServer = require("websocket").server;
// const express = require("express");
// const path = require("path");
// const app = express();

const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/javascript", (req, res) => {
    res.sendFile(__dirname + "/public/app.js");
});

app.get("/css", (req, res) => {
    res.sendFile(__dirname + "/public/style/style.css");
});

// app.listen(9091, () => console.log("listening to port 9091"));


// const httpServer = http.createServer();
http.listen(port, () => {
    console.log("server listening to port ", port);
});

// const wsServer = new websocketServer({
//     "httpServer": httpServer
// });

const clients = {};

io.on("connection", connection => {
    console.log("A user connected");
    // const connection = request.accept(null, request.origin);
    // connection.on("open", () => console.log("connection opened"));
    // connection.on("close", () => console.log("connection closed"));
    connection.on("disconnect", ()=> console.log("A user disconnected"));
    connection.on("message", message => {

        const result = JSON.parse(message);
        
        console.log(result);

        if(result.method === "play")
        {
            const payload = {
                "method": "play",
                "player": result.player
            }

           for(const c of Object.keys(clients)){
               clients[c].connection.emit("message", payload);
           }
        }

        if(result.method === "reset")
        {
            const payload = {
                "method": "reset"
            }

            for(const c of Object.keys(clients)){
                clients[c].connection.emit("message", payload);
            }
        }

        if(result.method === "changeScore")
        {
            const payload = {
                "method": "changeScore",
                "value": result.value
            }

            for(const c of Object.keys(clients)){
                clients[c].connection.emit("message", payload);
            }
        }

        if(result.method === "over")
        {
            const payload = {
                "method": "over"
            }

            for(const c of Object.keys(clients)){
                clients[c].connection.emit("message", payload);
            }
        }

    });

    // creating a new client id
    const clientId = guid();

    // pushing new client
    clients[clientId] = {
        "connection": connection
    }

    const payload = {
        "method": "connect",
        "clientId": clientId
    }

    connection.emit("message", payload);
});


// functions for creating unique id

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}
