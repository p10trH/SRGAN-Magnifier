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

//var gd = require('node-gd');
//var img = gd.createSync(200, 80);

/*
var PNGImage = require('pngjs-image');

var image = PNGImage.createImage(100, 300);
console.log(image.getWidth());
console.log(image.getHeight());

var pngjs = image.getImage();

image.fillRect(0, 0, image.getWidth(), image.getHeight(), {
    red: 255,
    green: 0,
    blue: 0,
    alpha: 100
})

image.writeImage('creatImageTest.png', function (err) {
    if (err) throw err;
    console.log('Written to the file');
});

*/

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
        // ...
        var newPath = __dirname + "/uploads/fromClient.png";
        fs.writeFile(newPath, data, function (err) {
            //res.redirect("back");
            res.status(200).send(req.file);


            // python
            var spawn = require('child_process').spawn,
                py = spawn('python', ['python/gan.py', newPath]),
                dataArray = [1, 2, 3, 4, 5, 6, 7, 8, 9],
                dataString = '';


            py.stdout.on('data', function (data2) {
                dataString += data2.toString();
            });

            py.stdout.on('end', function () {
                console.log('Sum of numbers=', dataString);
            });

            py.stdin.write(JSON.stringify(dataArray));
            py.stdin.end();
            // end python

        });

    });





    //return res.status(200).send(req.file);

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


    /*
        var delivery = dl.listen(socket);
        delivery.on('delivery.connect', function (delivery) {

            delivery.send({
                name: 'inPython.png',
                path: './inPython.png',
                params: {
                    foo: 'bar'
                }
            });

            delivery.on('send.success', function (file) {
                console.log('File successfully sent to client!');
            });

        });
    */

    /*    
        var news = [
            {
                title: 'The cure of the Sadness is to play Videogames',
                date: '04.10.2016'
            },
            {
                title: 'Batman saves Racoon City, the Joker is infected once again',
                date: '05.10.2016'
            },
            {
                title: "Deadpool doesn't want to do a third part of the franchise",
                date: '05.10.2016'
            },
            {
                title: 'Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales',
                date: '04.10.2016'
            },
        ];

        // Send news on the socket
        socket.emit('news', news);

        socket.on('my other event', function (data) {
            console.log(data);
        });
    */

    socket.on('buttonPress', function (data) {
        console.log(data);

        // handle python


    });
});

server.listen(4200);
