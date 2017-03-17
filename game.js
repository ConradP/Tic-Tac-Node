
module.exports = (function(){

	'use strict';

	function Game(player1,player2){
		console.log('constructing a new game');
		this.player1 = player1;
		this.player2 = player2;
		var fsm = require('javascript-state-machine').create({
			initial: 'matchmaking',
			events:[
			{name:'begin',from:'initialize',to :'player_1_turn'},
			{name:'player_1_turn_complete', from:'player_1_turn', to:'player_2_turn'},
			{name:'game_over',from:['player_1_turn','player_2_turn'] ,to:'game_overview'},
			{name:'rematch',from:'game_overview', to:'initialize' },
			]});
		fsm.onplayer_1_turn = function(){
	//check for end game condition
	//disable player2's board
	//enable player1's board
	//set input callback for player1
		}

		fsm.onplayer_2_turn = function(){
			//check for end game condition
			//disable player1's board
			//enable player2's board
		}

		fsm.ongame_overview = function(winner,loser){
			//update modal display for winner
			//update modal display for loser
			//ask for rematch
		}

		fsm.oninitialize = function(){
			//
		}

}

return{
	newGame: function(player1,player2){
		return new Game(player1,player2);
	}
}
}());