var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});

const fs = require('fs');
var sizeOf = require('image-size');

var dl = require('delivery');

var chokidar = require('chokidar');

var pathToWatch = __dirname + "/genImages/"

var watcher = chokidar.watch(pathToWatch, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true
});


// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use(express.static(__dirname + '/node_modules'));

app.use("/js", express.static(__dirname + "/js"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/genImages", express.static(__dirname + "/genImages"));

// Register the index route of your app that returns the HTML file
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/file-upload', upload.single('file'), function (req, res, next) {

    // Metadata about the uploaded file can now be found in req.file

    var dimensions = sizeOf(req.file.path);
    console.log(dimensions);

    fs.readFile(req.file.path, function (err, data) {
        
        var newPath = __dirname + "/uploads/fromClient.png";
        fs.writeFile(newPath, data, function (err) {
            res.status(200).send(req.file);

            // python
            var spawn = require('child_process').spawn,
                py = spawn('python', ['python/gan.py', newPath]);
            
            py.stdin.end();
            // end python

        });

    });

});

// Handle connection ------------------
io.on('connection', function (socket) {
    console.log("Connected to client ...");

    watcher
        .on('change', function (path) {
            console.log("File " + path + " has been changed");
            socket.emit('fileGenerated', "file was generated");
        })
        .on('add', function (path) {
            console.log("File " + path + " has been added");
            socket.emit('fileGenerated', "file was generated");
        });


    socket.on('buttonPress', function (data) {
        console.log(data);

        // handle
    });
});

server.listen(4200);
