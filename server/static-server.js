var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;
app.use('/', express.static(__dirname + "/../client"));
app.listen(port, function(){
	console.log('js-game listening on:', port);
});
