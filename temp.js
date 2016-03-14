|var $ = function(el) {
|	return document.querySelectorAll(el);
|};
|var chatform = document.getElementById('chatform');
|var chatbar = document.getElementById('m');
|var chatmsgs = document.getElementById('messages');
|var socket = io();
|var formSubmit = (function () {
|  socket.emit('chat message', chatbar.value);
|  chatbar.value = '';
|  return false;
|});
|socket.on('chat message', function (msg) {
|  chatmsgs.append($('<li>').html(msg));
|});
