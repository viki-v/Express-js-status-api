const express = require("express");
const router = express.Router();
const app = express();
const port = process.env.PORT || 8008;
require('events').EventEmitter.defaultMaxListeners = 150;




var status = require('./status');
status(app);




app.get('/', function (req, res) {
  res.send('hello, world!')
})
app.get('/asdasd/:eueu', function (req, res) {
  res.send('hello, world!')
})



app.listen(port, () => {
  console.log(`Listening on http://0.0.0.0:${port}`);
});




