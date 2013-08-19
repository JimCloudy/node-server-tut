var _ = require('underscore');
var express = require('express');
var view;

module.exports = {
	init: function(context,callback){
		var app = context.app = express();
		
		app.use(express.bodyParser());
		app.use('/static',express.static(__dirname + '/static'));

		view = context.view;

		app.get('/',function(req,res){
			context.db.posts.findAll(function(err,posts){
				if(err){
					notFound(res);
					return;
				}
				console.log("heading to main page");
		       	res.send(view.page('index',{posts:posts}));
			});
		});

		app.get('/posts/:slug',function(req,res){
			context.db.posts.findOneBySlug(req.params.slug,function(err,post){
				if(err||(!post)){
					notFound(res);
					return;
				}
		        res.send(view.page('post',{post:post}));
			});
		});

		app.get('/new',function(req,res){
			newPost(res);
		});

		app.post('/new',function(req,res){
			var post = _.pick(req.body,'title','body');
			context.db.posts.insert(post,function(err,post){
				if(err){
					newPost(res,"Make sure your title is unique.");
				}
				else{
					res.redirect('/posts/' + post.slug);
				}
			});
		});

		app.get('*',function(req,res){
			notFound(res);
		});

		function notFound(res){
			res.send('<h1>Page not found.</h1>',404);
		}

		function newPost(res,message)
	    {
		    res.send(view.page('new',{'message':message}));
	    }

	    callback();
	}
};