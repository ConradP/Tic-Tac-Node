var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var roomno = 1;

var userQue = [];

app.use(express.static(__dirname));

app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});

http.listen(3000,function(req,res){
	console.log('listening on port 3000');
});

io.on('connection',function(socket){
	console.log('user connected');
	socket.emit('update modal','connection established:');				
	console.log('placing user in game:'+roomno);
	socket.join('game:'+roomno);
	io.sockets.in('game:'+roomno).emit('update modal','searching for a player');

	// if two players are in the room
	//increment room number
	//start the game

	socket.on('disconnect',function(){
		console.log('user disconnected');
	});

	
});





//function removeFromQue(player)
//{
//	index = userQue.indexOf(player);
//	if (index>=0)
//	{
//		userQue.splice(index,1);
//		console.log('removing a user from the que');
//	}
//}