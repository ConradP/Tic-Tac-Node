var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lobby = [];
var tictac = require('./game.js');

//initialize the server
app.use(express.static(__dirname));

app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});

http.listen(3000,function(req,res){
	console.log('listening on port 3000');
});

io.on('connection',function(socket){
	_modalNotify(socket,'connected');
	console.log('user connected');
	lobby.push(socket);
	console.log('adding player to the que');
	if (lobby.length == 2)
	{
		player1 = lobby[0];
		player2 = lobby[1];
		console.log('pairing two players and removing from the que');
		var game = tictac.newGame(player1,player2);
		lobby.splice(lobby.indexOf(player1),1);
		lobby.splice(lobby.indexOf(player2),1);
	}

	socket.on('disconnect',function(){
		console.log('user disconnected');
		if(lobby.indexOf(socket)>=0)
		{
			lobby.splice(lobby.indexOf(socket),1);
		}
	});

	socket.on('player move',function(data){
			console.log(data);
	});
});

function _modalNotify(socket,msg){
	socket.emit('update modal',msg);
}

function _modalDiable(socket){
	socket.emit('disable modal');
}



