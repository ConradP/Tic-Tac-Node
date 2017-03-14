var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var StateMachine = require('javascript-state-machine');
var roomno = 1;
var userQue = [];


//initialize the server
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

// create the statemachine to represent the game state
// TODO: abstract out of the server for cleaner code
var game = StateMachine.create({
	initial: 'matchmaking',
	events:[
	{name:'match',        from: 'matchmaking', to:'game'   	    },
	{name:'turnComplete', from:'game',         to:'game'        },
	{name:'gameOver',     from:'game',         to:'gameOverview'},
	{name:'rematch',      from:'gameOverview', to:'matchmaking' }
	],
	
	callbacks:{
		onmatchmaking : matchMakingHandler,
		ongame: gameHandler,
		ongameOverview: gameOverviewHandler,
	}
});

function matchMakingHandler(event,from,to,msg){
	//if there are two or more people looking for a match
		//match them and event:match
	//else
		//wait for more people to join
}

function gameHandler(event,from,to,msg){
	//if the game is over event:gameOver
	//switch active player
	//wait for active player input, then EVENT:turnComplete
}

function gameOverviewHandler(event,from,to,msg){
	//display if the player won or lost
	//event:rematch
}
