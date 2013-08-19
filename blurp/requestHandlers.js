var querystring = require("querystring");

function start(request,response){
	console.log("Request handler 'start' was called.");

	var body = '<html>' +
		'<head>' +
		'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>' +
		'</head>' +
		'<body>' +
		'<form action="/upload" enctype="multipart/form-data" method="post">' +
		'<input type="file" name="upload">' +
		'<input type="submit" value="Upload File">' +
		'</form>' +
		'</body>' +
		'</html>';
	
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write(body);
	response.end();
}

function show(request,response){
	console.log("Request handler 'show' was called.");
	fs.readFile("./tmp/test.png","binary",function(error,file){
		if(error){
			response.writeHead(500,{"Content-Type":"text/plain"});
			response.write(error + "\n");
			response.end();
		}
		else{
			response.writeHead(200,{"Content-Type":"image/png"});
			response.write(file,"binary");
			response.end();
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;