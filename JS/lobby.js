
module.exports = (function(){
function Lobby(){

	this.playerList = [];

	this.isPair = function(){
		if (this.playerList.length>=2){
			return true;
		}
		else{
			return false;
		}
	}

	this.push = function(player){
		this.playerList.push(player);
	}

	this.remove = function(player){
		this.playerList.splice(this.playerList.indexOf(player),1);
	}
	
	this.getPair = function(){
		if(this.isPair()){
			var player1 = this.playerList[0];
			var player2 = this.playerList[1];
			this.remove(player2);
			this.remove(player1);
			var pair = [player1,player2];
			return pair;
		}
	}

	
}

return{
	newLobby: function(){
		return new Lobby();
	}
}
}())