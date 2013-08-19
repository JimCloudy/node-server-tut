var ejs = require('ejs');
var _ = require('underscore');
var fs = require('fs');

var options;
var templates = {};

module.exports = view = {
	init: function(optionsArg,callback){
		options = optionsArg;
		if(!options.viewDir){
			throw new Error("options.viewDir is required, please tell me where the views are");
		}
		callback();
	},
	page: function(template,data){
		if(!data){
			data = {};
		}
		_.defaults(data,{slots:{crumbs:[],title:'',bodyClass:''}});
		data.slots.body = view.partial(template,data);
		_.defaults(data.slots,{layout:'layout'});
		
		if(data.slots.layout === false){
			return data.slots.body;
		}

		return view.partial(data.slots.layout, {slots: data.slots});
	},
	partial: function(template,data){
		if(!data){
			console.log("partial: no data");
			data = {};
		}
		console.log("partial: before template check");
		if(!templates[template]){
			console.log("partial: no templates");
			templates[template] = ejs.compile(fs.readFileSync(options.viewDir + '/' + template + '.ejs','utf8'));
		}
		console.log("partial: before data partial check");
		if(!data.partial){
			console.log("partial: no data partial");
			data.partial = function(partial,partialData){
				if(!partialData){
					partialData = {};
				}

				_.defaults(partialData,{slots: data.slots});
				return view.partial(partial,partialData);
			};
		}
		console.log("partial: set defaults");
		_.defaults(data,{slotS:{},_: _});

		return templates[template](data);
	}
}