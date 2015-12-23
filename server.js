var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './client')));

require('./server/config/routes.js')(app);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});