var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello, world!');
});

app.use(express.static('www'));

var server = app.listen(8000, function() {
  console.log('Spark running at on port %s', server.address().port);
});
