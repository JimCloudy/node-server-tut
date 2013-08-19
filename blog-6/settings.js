module.exports={
	db:{
		host:'localhost',
		port:'27017',
		name:'justjsblog'
	},
	http:{
		port:3000
	},
	sessionSecret:'h15ln3u8vd',
	google: {
    	returnURL: 'http://localhost:3000/auth/google/callback',
    	realm: 'http://localhost:3000/'
  	},
  	posters: 'jimcloudy11@gmail.com'
};