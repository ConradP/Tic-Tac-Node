// create the statemachine to represent the game state
// TODO: abstract out of the server for cleaner code
var StateMachine = require('javascript-state-machine');

var game = StateMachine.create({
	initial: 'matchmaking',
	events:[
	{name:'begin'    from: 'initialize' to :'player_1_turn'},
	{name:'player_1_turn_complete', from:'player_1_turn', to:'player_2_turn'},
	{name:'game_over',from:['player_1_turn','player_2_turn'] ,to:'game_overview'},
	{name:'rematch',from:'game_overview', to:'initialize' },
		   ]});

//callbacks

game.onplayer_1_turn = function(){
	//check for end game condition
	//disable player2's board
	//enable player1's board
	//set input callback for player1
}

game.onplayer_2_turn = function(){
	//check for end game condition
	//disable player1's board
	//enable player2's board
}

game.ongame_overview = function(winner,loser){
	//update modal display for winner
	//update modal display for loser
	//ask for rematch
}

game.oninitialize = function(){
	//
}

var board = [[0,0,0],
			 [0,0,0],
			 [0,0,0]]



	
