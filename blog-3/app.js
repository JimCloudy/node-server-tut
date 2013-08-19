var _ = require('underscore');
var express = require('express');

module.exports = {
	init: function(context,callback){
		var app = context.app = express();
		
		app.use(express.bodyParser());

		app.get('/',function(req,res){
			context.db.posts.findAll(function(err,posts){
				if(err){
					notFound(res);
					return;
				}
				var s = "<title>My NODEJS Blog</title>\n";
		        s += "<h1>My Blog</h1>\n";
		        s += '<p><a href="/new">New Post</a></p>' + "\n";
		       	s += "<ul>\n";

		       	for(var slug in posts){
		       		var post = posts[slug];
		       		s += '<li><a href="/posts/' + post.slug + '">' + post.title + '</a></li>' + "\n";
		       	}
		       	s += "</ul><br>";
		       	res.send(s);
			});
		});

		app.get('/posts/:slug',function(req,res){
			context.db.posts.findOneBySlug(req.params.slug,function(err,post){
				if(err||(!post)){
					notFound(res);
					return;
				}
				var s = "<title>" + post.title + "</title>\n";
		        s += "<h1><a href='/'>My Blog</a></h1>\n";
		        s += "<h2>" + post.title + "</h2>\n";
		        s += post.body;
		        res.send(s);
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
	    	var s = "<title>New Post</title>\n";
	      	s += "<h1>My Blog</h1>\n";
		    s += "<h2>New Post</h2>\n";
		    if (message)
		    {
		    	s += "<h3>" + message + "</h3>\n";
		    }
		    s += '<form method="POST" action="/new">' + "\n";
		    s += 'Title: <input name="title" /> <br />' + "\n";
		    s += '<textarea name="body"></textarea>' + "\n";
	     	s += '<input type="submit" value="Post It!" />' + "\n";
		    s += "</form>\n";
		    res.send(s);
	    }

	    callback();
	}
};