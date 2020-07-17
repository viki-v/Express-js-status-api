Status Monitor api 

 ```javascript 
 const express = require("express");
 
 const app = express();
 
 var status = require('./status');
 
 status(app);
  
 ```
Listening on http://0.0.0.0:8008

To RUN APP 
      
	   npm install 
	   node app.js or nodemon app.js 