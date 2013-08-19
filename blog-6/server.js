var context = {};
context.settings = require('./settings');

var async = require('async');
async.series([setupDb,setupView,setupApp,listen],ready);

function setupDb(callback){
	context.db = require('./db');
	context.db.init(context,callback);
}

function setupView(callback){
	context.view = require('./view');
	context.view.init({viewDir: __dirname + '/views'},callback);
}

function setupApp(callback){
	context.app = require('./app');
	context.app.init(context,callback);
}

function listen(callback){
	context.app.listen(context.settings.http.port);
	callback(null);
}

function ready(err){
	if(err){
		throw err;
	}
	console.log("Ready and listening at localhost:" + context.settings.http.port);
}




