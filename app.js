const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

let players = {};
let messages = {};

io.on('connection', (socket) => {
    socket.on('player-new', (player) =>{
        players[socket.id] = player;
        socket.emit('player-list', players);
        socket.broadcast.emit('player-new', player);
    });

    socket.on('player-move', (player) => {
        players[socket.id].x = player.x;
        players[socket.id].y = player.y;
        socket.broadcast.emit('player-move', player);
    });

    socket.on('started-writing', (user)=>{
        socket.broadcast.emit('started-writing',user);
    });
    socket.on('ended-writing', (user)=>{
        socket.broadcast.emit('ended-writing',user);
    });

    socket.on('message', (message)=>{
        io.emit('message', message);
    });

    socket.on('disconnect', ()=>{
        io.emit('player-quit', players[socket.id]);
        delete players[socket.id];
    });

});

server.listen(3000, ()=>{
    console.log("Listening on 3000 !");
});