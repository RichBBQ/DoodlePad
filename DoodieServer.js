var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(
	function (request, response) {
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
);

io = io.listen(8001);
io.sockets.on('connection', function(socket){
	console.log('OH YEA< CONNECTED');
	socket.on('testEvent', function(data){
		console.log(data);
	});
	socket.on('data', function(data){
		console.log(data);
	});
});

server.listen(8000);
console.log('listening to localhost:8000');
