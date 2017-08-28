var sockets = {};

exports.init = function(io) {
  io.on('connect', function (socket) {
    var user = socket.handshake.query.user;
    sockets[user] = socket;
    socket.on('heartbeat', function(data) { });
    socket.on('disconnect', function() {
      if(socket.hasOwnProperty(user)) {
        delete sockets[user];
      }
      console.log(user + ' disconnected');
    });
    console.log(user + ' connected');
  });
};

exports.updateList = function(list) {
  list.users.forEach(function(user) {
    if(sockets.hasOwnProperty(user)) {
      if(sockets[user]) {
        sockets[user].emit('refreshList', list.toJSON());
      } else {
        delete sockets[user];
      }
    }
  });
};
