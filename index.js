var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var maxListeners = require('events').EventEmitter.prototype._maxListeners = 100;
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


var jugador=1;
var clients = 0;
var bloquearCelda = 'nopintable';

io.on('connection', function(socket){

  clients++;
   io.sockets.emit('broadcast',{ description: clients + ' jugadores conectados!'});
   socket.on('disconnect', function () {
      clients--;
      io.sockets.emit('broadcast',{ description: clients + ' jugadores conectados!'});
   });

  
  

  //EJEMPLO DE ENVIAR EVENTO AL CLIENTE
  /*setTimeout(function() {
    //Sending an object when emmiting an event
    socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});
 }, 4000);*/

  //EJEMPLO DE RECIBIR EVENTO DESDE EL CLIENTE
  /*socket.on('clientEvent', function(data) {
    //var datos = data;
    //console.log(datos);
 });*/

  //io.emit emite a todos
  //socket.emit emite a quien se conecte


  //AL EMPEZAR LA PARTIDA
  socket.emit('jugador',{jugador:jugador});
  socket.on('color',function (color){
    socket.emit('color',{color:colors[jugador]})
  })
  
  //AL PINTAR
  socket.on('idCelda', function(id){
    socket.on('colorCelda',function(colorCelda){
      io.emit('pintarCelda',{id:id, color:colorCelda, bloquear:bloquearCelda});
    })
  });



  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

  jugador++;

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
