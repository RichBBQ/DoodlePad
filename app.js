/*
var app = require('express').createServer();
app.get('/', function(req, res) {
    res.send('Hello from Cloud Foundry from richard shen');
});
app.listen(4567);
*/

var doodieApp = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require('socket.io').listen(doodieApp);
var activeSockets = [];

doodieApp.listen(80);

function handler (request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('query file: ' + pathname.substring(1));

    var responseData;
    if ( pathname == "/" ) {
        console.log("hit");
        response.writeHead(200);
        responseData = fs.readFileSync('Doodie.html');
    }

    else {
        var filename = pathname.substring(1);
        responseData = fs.readFileSync(filename);
    }

    response.end(responseData);
}


io.sockets.on('connection', function(socket){
    console.log('socket:' + socket);
    activeSockets.push(socket);

    socket.on('testEvent', function(data){
        console.log(data);
    });

    socket.on('draw event', function(data) {
        console.log('sx:'+data.startX+ ' ex:'+data.endX+ ' sy:'+data.startY+' ey:'+data.endY);
        for (var i=0; i<activeSockets.length; i++) {
            if (activeSockets[i] != socket){
                activeSockets[i].emit('peer draw event', data);
            }
        }
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
        var i = activeSockets.indexOf(socket);
        activeSockets.splice(i, 1);
    });
});

