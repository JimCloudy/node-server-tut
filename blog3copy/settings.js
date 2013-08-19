// Settings for our app. The 'require' call in server.js returns
// whatever we assign to 'module.exports' in this file

module.exports = { 
  // MongoDB database settings
  db: {
    host:'localhost',
    port:'27017',
    name:'justjsblog'
  },
  // Port for the webserver to listen on
  http: {
    port: 3000
  },
};
