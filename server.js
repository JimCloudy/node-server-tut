var http = require("http");
var url = require("url");

function start(route,handle){
	function onRequest(req,res){
		var pathname = url.parse(req.url).pathname;
		console.log("Request for " + pathname + " received.");
		route(handle,pathname,req,res);
	}

	http.createServer(onRequest).listen(8888);

	console.log("Server has started.");
}

exports.start = start;