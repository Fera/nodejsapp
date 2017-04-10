var fs = require('fs');

var render = function(response, view, params, httpCode){
	fs.readFile(view, 'utf8', function(err, data){
		if(err){
			console.log(err);
			return;
		}

		params = params || {};
		httpCode = httpCode || 200;

		for(var key in params){
			data = data.replace(new RegExp('@' + key + '@', 'g'), params[key]);
		}

		response.writeHead(httpCode, {'Content-type': 'text/html'});
		response.write(data);
		response.end();
	});
};

exports.render = render;