var express = require('express');
var compression = require('compression');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.static('www'));

app.set('port', process.env.PORT || 8080);
// Initialize the app.
// app.listen(app.get('port'), function () {
//   console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port'));
// });

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

app.get("/heartbeat", (req, res, next) => {
  res.send("hello");
});

