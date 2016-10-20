var http = require('http');
var fs = require('fs');
var path = require('path');

// sync version
function walkSync(currentDirPath) {
	var list_file = [];
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            list_file.push(filePath);
        } 
    });
    return list_file;
}

// json file creation
function export_portfolio_json(list_file) {
	var list_to_export = {
  		'portfolio': [],
  		'state': true
	};
	for (var i = 0; i < list_file.length; i++) {
		if( list_file[i].indexOf("min-") !== -1) {
			for (var j = 0; j < list_file.length; j++) {
				if( list_file[j] == list_file[i].replace("min-", "")) {
					list_to_export.portfolio.push({'name' : list_file[j].replace("min-", ""), 'miniature' : list_file[j]});
				}
			}	
		}
	}
	return JSON.stringify(list_to_export);
}


// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
	console.log("connected");
    socket.emit('message', 'connected');

    socket.on('message', function (message) {
    	console.log(message)
    	if(message == "update_json") {
    		var list_file = walkSync('../images');
    		for (var i = 0; i < list_file.length; i++) {
				list_file[i] = list_file[i].replace("..\\", "").replace("\\", "/")
    		}
    		list_json = export_portfolio_json(list_file);
    		fs.writeFileSync("../list_portfolio.json", list_json, "UTF-8");
    		console.log("update_json_done")
    		this.emit('message', "update_json_done");
    	}
	});
});


// Buffer mydata
  var BUFFER = bufferFile('../images/Portfolio-min-13.jpg');

  function bufferFile(relPath) {
    return fs.readFileSync(path.join(__dirname, relPath)); // zzzz....
  }


var parser = require('exif-parser').create(BUFFER);
var result = parser.parse();



server.listen(8080);