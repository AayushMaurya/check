var app = require('express')();
var http = require('http').Server(app);
const port = process.env.PORT || 3000

var io = require('socket.io')(http);

app.get('/', function(req, res){
   res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket){
    console.log('A user connected');
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });

    socket.on("message", (message) => {
        const result = JSON.parse(message);
        console.log(result.method);
    })
 });

http.listen(port, function(){
   console.log('listening on *:3000');
});