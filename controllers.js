var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var mysql = require('mysql');
var templating = require('./templating.js');


function index(request, response){
	templating.render(response, 'views/index.html', {
		pageTitle: 'Strona główna'
	});
}

function form(request, response){	
	templating.render(response, 'views/form.html', {
		pageTitle: 'Formularz rejestracji'
	});
}

function saveForm(request, response){

	var uploadPath = 'files/';

	var generateNewFileName = function(fileName){
		var prefix = Math.floor((Math.random() * 1000) + 1);
		return prefix + '_' + fileName;
	};

	var onSaveError = function(response){
		templating.render(response, 'views/saveError.html',{
			pageTitle: 'Wystąpił błąd zapisu!'
		});
	};

	var onSaveSuccess = function(response, orderId) {
		templating.render(response, 'views/saveSuccess.html', {
			pageTitle: 'Poprawnie zapisano!',
			orderId: orderId
		});
	};	

	if('POST' === request.method) {

		var form = new formidable.IncomingForm();

		form.parse(request, function(err, fields, files){

			if(err){
				onSaveError(response);
				console.log(err);
				return;
			}

			var newName = generateNewFileName(files.paymentFile.name);

			fs.rename(files.paymentFile.path, uploadPath + newName, function(err){
				if(err){
					onSaveError(response);
					console.log(err);
					return;
				}

				var saveData = {};
				saveData['name'] = fields.name;
				saveData['file_name'] = newName;

				var conn = mysql.createConnection({
					host: 'localhost',
					user: 'root',
					password:'',
					database: 'nodejsapp'
				});

				conn.connect();

				conn.query('INSERT INTO users SET ?', saveData, function(err, result){
					if(err){
						onSaveError(response);
						console.log(err);
						return;
					}

					onSaveSuccess(response, result.insertId);
				});
			});
		});

	} else {
		response.writeHead(301, {'Content-type':'text/plain'});
		response.end('Only POST Method Available!');
	}	
};

function error404(request, response){
	templating.render(response, 'views/error404.html', {
		pageTitle: 'Strona nie została znaleziona'
	});
};

exports.index = index;
exports.form = form;
exports.saveForm = saveForm;
exports.error404 = error404;