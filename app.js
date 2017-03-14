var socket = io();


socket.on('update modal',function(msg){
	$('#modal-body').empty();
	$('#modal-body').append(msg+'<br>');
	$('#modal').modal();
});





