var _ = require('underscore');
var express = require('express');
var passport = require('passport');
var minimatch = require('minimatch');
var connectMongoDb = require('connect-mongodb');
 
var view;

module.exports = {
	init: function(context,callback){
		var app = context.app = express();
		
		app.use(express.bodyParser());
		app.use('/static',express.static(__dirname + '/static'));
		app.use(express.cookieParser());

		var mongoStore = new connectMongoDb({db:context.mongoConnection});
		app.use(express.session({secret:context.settings.sessionSecret,store:mongoStore}));

		configurePassport();

		view = context.view;

		app.get('/',function(req,res){
			context.db.posts.findAll(function(err,posts){
				if(err){
					notFound(res);
					return;
				}
				console.log("heading to main page");
		       	page(req, res, 'index', {posts: posts});
			});
		});

		app.get('/posts/:slug',function(req,res){
			context.db.posts.findOneBySlug(req.params.slug,function(err,post){
				if(err||(!post)){
					notFound(res);
					return;
				}
		        page(req, res, 'post', {post: post});
			});
		});

		app.get('/new',function(req,res){
			if(!validPoster(req,res)){
				return;
			}
			newPost(req,res);
		});

		app.post('/new',function(req,res){
			if(!validPoster(req,res)){
				return;
			}
			var post = _.pick(req.body,'title','body');
			context.db.posts.insert(post,function(err,post){
				if(err){
					newPost(req,res,"Make sure your title is unique.");
				}
				else{
					res.redirect('/posts/' + post.slug);
				}
			});
		});

		app.get('*',function(req,res){
			notFound(res);
		});

		callback();

		function notFound(res){
			res.send('<h1>Page not found.</h1>',404);
		}

		function newPost(req,res,message)
	    {
		    page(req,res,'new',{'message':message});
	    }

	    function validPoster(req,res){
	    	if(!req.user){
	    		res.redirect('/auth/google');
	    		return false;
	    	}

	    	if(!minimatch(req.user.email,context.settings.posters)){
	    		req.session.error = "Sorry, you do not have permission to post to this blog";
	    		res.redirect('/');
	    		return false;
	    	}

	    	return true;
	    }

	    function page(req,res,template,data)
    	{	
      		_.defaults(data,{ slots: {} });
      		console.log(req.user + " : " + req.session);
      		_.defaults(data.slots,{ user: req.user, session: req.session });
      		res.send(view.page(template, data));
    	}

	    function configurePassport(){
	    	var GoogleStrategy = require('passport-google').Strategy;
	    	
	    	passport.use(new GoogleStrategy(context.settings.google,function(identifier,profile,done){
	    		var user = {'email':profile.emails[0].value,'displayName':profile.displayName};
	    		done(null,user);
	    	}));
	    	
	    	passport.serializeUser(function(user,done){
	    		done(null,JSON.stringify(user));
	    	});
	    	
	    	passport.deserializeUser(function(json,done){
	    		var user = JSON.parse(json);
	    		if(user){
	    			done(null,user);
	    		}
	    		else{
	    			done(new Error("Bad JSON string in session"),null);
	    		}
	    	});

	    	app.use(passport.initialize());
	    	app.use(passport.session());

	    	app.get('/auth/google',passport.authenticate('google'));

	    	app.get('/auth/google/callback',passport.authenticate('google',{successRedirect:'/',failureRedirect:'/'}));

	    	app.get('/logout',function(req,res){
	    		req.logOut();
	    		res.redirect('/');
	    	});
	    }
	}
};