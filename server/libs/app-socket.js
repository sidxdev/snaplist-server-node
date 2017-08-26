var sockets = {};

exports.init = function(io) {
  io.on('connection', function (socket) {
    sockets[socket.handshake.query.user] = socket;
    console.log(socket.handshake.query.user + ' connected');
  });
};

exports.updateList = function(list) {
  list.users.forEach(function(user) {
    sockets[user].emit('refreshList', list.toJSON());
  });
};