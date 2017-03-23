
module.exports = (function(){

	'use strict';

	function Game(player1,player2){
		console.log('constructing a new game');
		this.player1 = player1;
		this.player2 = player2;
		var player1_token = './images/X_icon.png';
		var player2_token = './images/O_icon.png';
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
				onplayer_1_win: player1WinHandler,
				onplayer_2_win: player2WinHandler,
			}
		});

		//set callbacks for player input
		player1.on('player move',function(spot){
			console.log('update board event received ' + spot);
			console.log(board[spot]);
			if(board[spot-1]==0)
			{
				board[spot-1] =1;
				player1.emit('update board',spot,player1_token);
				player2.emit('update board', spot,player1_token);
				fsm.player_1_turn_complete();
			}
			console.log(board[spot]);
		});

		player2.on('player move',function(spot){
			console.log('update board event received ' + spot);
			if(board[spot-1]==0)
			{
				board[spot-1]=2;
				player2.emit('update board',spot,player2_token);
				player1.emit('update board',spot,player2_token);
				fsm.player_2_turn_complete();
			}
		});

		function cats_gameHandler(){
			player2.emit('disable board');
			player2.emit('update modal','cat\'s game');
			player1.emit('disable board');
			player1.emit('update modal','cat\'s game');
		}

		function player_2_win_checkHandler(){
			if(winnerCheck(2,board)){
				fsm.player_2_win();
			}
			else if(catCheck(board)){
				fsm.cats_game();
			}
			else{
				fsm.player_1_active();
			}
		};
		function player_1_win_checkHandler()
		{
			console.log('player_1_win_check');
			if(winnerCheck(1,board)){
				fsm.player_1_win();
			}
			else if(catCheck(board)){
				fsm.cats_game();
			}
			else{	
				fsm.player_2_active();
			}
		};

		function player_1_turnHandler(){
			_turnHandler(player1,player2);	
		};

		function player_2_turnHandler(){
			_turnHandler(player2,player1);
		};

		function _turnHandler(active,inactive){
			console.dir(this);
			inactive.emit('disable board');
			inactive.emit('update modal','waiting for other player');
			active.emit('enable board');
			active.emit('disable modal');
		}

		function game_overviewHandler(){
			console.log('game over handler');
			setTimeout(function(){
				player1.emit('update modal','refresh the browser to play again');
				player2.emit('update modal','refesh the browser to play again');
				console.log('timeout function executed!');
			}, 5000);
		};

		function initializeHandler(){
			console.log('initialize handler');
			player1.emit('clear board');
			player2.emit('clear board');
			this.begin();
		};

		function winnerCheck(player,board){
			console.log('winnerCheck');
			//diag 
			if(board[0]==player && board[4]==player&&board[8]==player) return true;
			//diag
			if(board[2]==player && board[4]==player&&board[6]==player) return true;
			//columns
			for (var i=0;i<3;i++)
			{
				if (board[i]==player&&board[i+3]==player&&board[i+6]==player) return true;
			}
			//rows
			for (var i=0;i<=6;i+=3){
				if(board[i]==player&&board[i+1]==player&&board[i+2]==player) return true;
			}
			console.log('returning false');
			return false;
		}

		function catCheck(board){
			for(var index in board)
			{
				if (board[index] == 0) return false;
			}
			return true;
		}

		function player1WinHandler(){
			player1.emit('disable board');
			player1.emit('update modal','you won!');
			player2.emit('disable board');
			player2.emit('update modal','you lose!');
		}

		function player2WinHandler(){
			player2.emit('disable board');
			player2.emit('update modal','you won!');
			player1.emit('disable board');
			player1.emit('update modal','you lose!');
		}
	}

	return{
		newGame: function(player1,player2){
			return new Game(player1,player2);
		}
	}
}());