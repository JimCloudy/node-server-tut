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
		_.defaults(data,{slots: {} });
		_.defaults(data.slots,{crumbs:[],title:'',bodyClass:''});
		data.slots.body = view.partial(template,data);
		
		_.defaults(data.slots,{layout:'layout'});
		
		if(data.slots.layout === false){
			return data.slots.body;
		}
		
		return view.partial(data.slots.layout, {slots: data.slots});
	},
	partial: function(template,data){
		if(!data){
			data = {};
		}
		
		if(!templates[template]){
			templates[template] = ejs.compile(fs.readFileSync(options.viewDir + '/' + template + '.ejs','utf8'));
		}
		
		if(!data.partial){
			data.partial = function(partial,partialData){
				if(!partialData){
					partialData = {};
				}

				_.defaults(partialData,{slots: data.slots});
				return view.partial(partial,partialData);
			};
		}
		
		_.defaults(data,{slots:{},_: _});
		
		return templates[template](data);
	}
};