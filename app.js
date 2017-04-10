var controllers = require('./controllers.js');
var server = require('./server.js');

var routing = {
	'/': controllers.index,
	'/form': controllers.form,
	'/save-form': controllers.saveForm,
	'/erro404': controllers.erro404
};

server.start(routing);


