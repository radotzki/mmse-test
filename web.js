var static = require('node-static');

var file = new(static.Server)('./dist');
var port = process.env.PORT || 5000;
require('http').createServer(function (request, response) {
	file.serve(request, response, function(err, result){
		if(err && (err.status === 404)){
		        file.serveFile('/index.html', 200, {}, request, response);
		}
	});
}).listen(port);