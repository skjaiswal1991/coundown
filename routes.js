module.exports = function(io) {
  var routes = {};
  routes.index = function (req, res) {
    io.sockets.emit('payload');
    res.render('index', {
      title: "Awesome page"
    });
  };
  
  io.on('connection',function(socket){
    console.log('socket is working here');
    
    socket.emit('mess',"testdayahjfgsdf sdbs sdsf sdfhsbsdfbsf sdfbksfs dfsdfksf sdbfsbfsd vbdfs f,h");
  })
  //return routes;

};

