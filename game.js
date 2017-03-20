
module.exports = (function(){

	'use strict';

	function Game(player1,player2){
		console.log('constructing a new game');
		this.player1 = player1;
		this.player2 = player2;
		var player1_token = 'X_icon.png';
		var player2_token = 'O_icon.png';
		var board = [0,0,0,0,0,0,0,0,0];
		var fsm = require('javascript-state-machine').create({
			initial: 'initialize',
			events:[
			{name:'begin',from:'initialize',to :'player_1_turn'},
			{name:'player_1_turn_complete', from:'player_1_turn', to:'player_1_win_check'},
			{name:'player_2_turn_complete',from:'player_2_turn',to:'player_2_win_check'},
			{name:'player_1_win',from:'player_1_win_check',to:'game_over'},
			{name:'player_2_win',from:'player_2_win_check',to:'game_over'},
			{name:'cats_game',from:['player_1_win_check','player_2_win_check'],to:'game_over'},
			{name:'player_1_active',from:'player_2_win_check',to:'player_1_turn'},
			{name:'player_2_active',from:'player_1_win_check',to:'player_2_turn'},
			{name:'rematch',from:'game_over', to:'initialize' },
			],
			callbacks:{
				oninitialize: initializeHandler,
				onplayer_1_turn: player_1_turnHandler,
				onplayer_2_turn: player_2_turnHandler,
				ongame_over: game_overviewHandler,
				onplayer_1_win_check: player_1_win_checkHandler,
				onplayer_2_win_check: player_2_win_checkHandler,
				oncats_game: cats_gameHandler,
			}
		});

		//set callbacks for player input
		player1.on('player move',function(spot){
			if(board[spot]==0)
			{
				board[spot] =1;
				player1.emit('update board',spot,player1_token);
				player2.emit('update board', spot,player1_token);
				fsm.player_1_turn_complete();
			}
		});

		player2.on('player move',function(spot){
			if(board[spot]==0)
			{
				board[spot]=2;
				player2.emit('update board',spot,player2_token);
				player1.emit('update board',spot,player2_token);
				fsm.player_2_turn_complete();
			}
		});

		function cats_gameHandler(){

		}

		function player_2_win_checkHandler(){
				if(winnerCheck(player2)){
					fsm.player_2_win();
				}
				else{
					fsm.player_1_active();
				}
		};
		function player_1_win_checkHandler()
		{
				if(winnerCheck(player1)){
					fsm.player_1_win();
				}
				else{
					fsm.player_2_active();
				}
		};

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
		};

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
		};

		function game_overviewHandler(winner,loser){
			console.log('game_overviewHandler')
			//update modal display for winner
			//update modal display for loser
			//ask for rematch
		};

		function initializeHandler(){
			console.log('initialize handler');
			player1.emit('clear board');
			player2.emit('clear board');
			this.begin();
		};

		function winnerCheck(player){
			
		}
	}

	return{
		newGame: function(player1,player2){
			return new Game(player1,player2);
		}
	}
}());