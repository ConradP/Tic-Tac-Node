var socket = io();

//displays a message in the modal menu sent from the server
socket.on('update modal',function(msg){
	_updateModal(msg);
	_showModal();
});
//hides the modal display when istructed to by the server
socket.on('disable modal',function(){
	_hideModal();
});
//notifies the server when the client has disconnected
socket.on('disconnect',function(){
	_updateModal('disconnected from the server');
	_showModal();
});
//updates the proper board space with the proper icon when instructed to by the server
socket.on('update board',function(id,icon){
	console.log('update board event fired: ' + id + '   ' +icon);
	$('#'+id).append($('<img src="'+icon+'">'));
});
//enable player to make a move on the board
socket.on('enable board',function(){
	_enableBoard();
});
//disable player from making moves on the board
socket.on('disable board',function(){
	_disableBoard();
});

socket.on('clear board', function(){
	_clearBoard();
})











/* private function definitions*/
function _updateModal(msg){
	$('#modal-body').empty();
	$('#modal-body').append(msg+'<br>');
}

function _showModal(){
$('#modal').modal('show');
}

function _hideModal(){
$('#modal').modal('hide');
}

var _moveHandler = function(){
	socket.emit('player move',$(this).prop('id'));
};

function _enableBoard(){
	$('.board_space').bind('click', _moveHandler);
};

function _disableBoard(){
	$('.board_space').unbind('click',_moveHandler);
}

function _clearBoard(){
	$('.board_space').empty();
}





