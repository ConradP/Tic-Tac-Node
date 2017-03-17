var socket = io();


socket.on('update modal',function(msg){
	updateModal(msg);
	showModal();
});

socket.on('disable modal',function(){
	hideModal();
});

socket.on('disconnect',function(){
	updateModal('dsconnected from the server');
	showModal();
});



function updateModal(msg){
	$('#modal-body').empty();
	$('#modal-body').append(msg+'<br>');
}

function showModal(){
$('#modal').modal('show');
}

function hideModal(){
$('#modal').modal('hide');
}

function enableBoard(){
	$('.board_space').bind('click',function(){
		socket.emit('player move',$(this).prop('id'));
	});
};

function disableBoard(){
	$('.board_space').unbind();
}





