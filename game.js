
module.exports = (function(){

	'use strict';

	function Game(player1,player2){
		console.log('constructing a new game');
		this.player1 = player1;
		this.player2 = player2;
		var player1_token = 'X_icon.png';
		var player2_token = 'O_icon.png';
		var fsm = require('javascript-state-machine').create({
			initial: 'initialize',
			events:[
			{name:'begin',from:'initialize',to :'player_1_turn'},
			{name:'player_1_turn_complete', from:'player_1_turn', to:'player_2_turn'},
			{name:'player_2_turn_complete',from:'player_2_turn',to:'player_1_turn'},
			{name:'game_over',from:['player_1_turn','player_2_turn'] ,to:'game_overview'},
			{name:'rematch',from:'game_overview', to:'initialize' },
			],
			callbacks:{
				oninitialize: initializeHandler,
				onplayer_1_turn: player_1_turnHandler,
				onplayer_2_turn: player_2_turnHandler,
				ongame_overview: game_overviewHandler,
			}
		});

		//set callbacks for player input
		player1.on('player move',function(spot){
				fsm.player_1_turn_complete();
			});

		player2.on('player move',function(spot){
				fsm.player_2_turn_complete();
			})

		function player_1_turnHandler(){
			console.log('player_1_turnHandler')
			//check for end game condition
			//disable player2's board
			player2.emit('disable board');
			player2.emit('update modal','waiting for player 1');
			//enable player1's board
			player1.emit('enable board');
			player1.emit('disable modal');
			console.dir(this.current);
			//set input callback for player1
			
		}

		function player_2_turnHandler(){
			console.log('player_2_turnHandler')
			//check for end game condition
			//disable player1's board
			player1.emit('disable board');
			player1.emit('update modal','waiting for player 2');
			//enable player2's board
			player2.emit('enable board');
			player2.emit('disable modal');
			console.dir(this.current);
			//set input callback for player2
			
		}

		function game_overviewHandler(winner,loser){
			console.log('game_overviewHandler')
			//update modal display for winner
			//update modal display for loser
			//ask for rematch
		}

		function initializeHandler(){
			console.log('initialize handler');
			player1.emit('clear board');
			player2.emit('clear board');
			this.begin();
		}

		var board = [[0,0,0],
					 [0,0,0],
					 [0,0,0]]
}

return{
	newGame: function(player1,player2){
		return new Game(player1,player2);
	}
}
}());