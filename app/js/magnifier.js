// Notes:
//      - when done, take out display attribute from startPage css 



var imageUploaded = false;

var realImageWidth = 0,
    realImageHeight = 0;

var scaledImageWidth = 0,
    scaledImageHeight = 0;

var copyOfOrigImage = new Image();

var standardImgs = new Array();
var superResImgs = new Array();

var toggleArray = new Array(2);

var magnificationFactor = 2;

var xMouse = 0,
    yMouse = 0;

var xMouseRaw = 0,
    yMouseRaw = 0;

var startPageDiv = document.getElementById("startPage");
var magnifierPageDiv = document.getElementById("magnifierPage");

var imagesContainerDiv = document.getElementById("imageContainer");
var originalImageContainerDiv = document.getElementById("originalImageContainer");
var magnifiedImageContainerDiv = document.getElementById("magnifiedImageContainer");

var originalImageEle = document.getElementById("originalImage");
var magnifiedlImageEle = document.getElementById("magnifiedlImage");

var idealResEle = document.getElementById("idealRes");

var imageInfoEle = document.getElementById("imageInfo");

var imageNameEle = document.getElementById("imageName");
var imageSizeEle = document.getElementById("imageSize");
var imageWidthEle = document.getElementById("imageWidth");
var imageHeightEle = document.getElementById("imageHeight");


var imageModeEle = document.getElementById("imageMode");

var magFactorEle = document.getElementById("magFactor");

originalImageEle.addEventListener("mousemove", onImageMouseMove, false);
originalImageEle.addEventListener("mouseenter", onImageMouseEnter, false);
originalImageEle.addEventListener("mouseleave", onImageMouseLeave, false);


document.addEventListener("keypress", handleKeyPress);

// --------------------------------------------------------------------------------------------------------
// DROPZONE (drag and drop file)

Dropzone.options.imageDropZone = {
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 50, // MB
    maxFiles: 1,
    acceptedFiles: 'image/*',
    autoProcessQueue: true,
    createImageThumbnails: true,
    accept: function (file, done) {

        startPageDiv.style["display"] = "none";
        imageUploaded = true;


        var reader = new FileReader();

        reader.onload = function (e) {
            //fileDisplayArea.innerHTML = "";

            var img = new Image();
            img.src = reader.result;

            img.onload = function () {
                // access image size here 
                //console.log(this.height);
                realImageWidth = this.width;
                realImageHeight = this.height;


                imageWidthEle.innerHTML = "WIDTH:  " + realImageWidth + " pixels";
                imageHeightEle.innerHTML = "HEIGHT:  " + realImageHeight + " pixels";

                //var widthTemp = realImageWidth * 2;
                //var heightTemp = realImageHeight * 2;


                copyOfOrigImage.src = this.src;
                //imgTemp.width = (2 * this.width);
                //imgTemp.height = (2 * this.height);

                console.log("standard");
                for (var i = 0, ref = standardImgs.length = 10; i < ref; i++) {

                    var imgTemp = document.createElement("IMG");

                    imgTemp.src = copyOfOrigImage.src;
                    imgTemp.alt = "";

                    if (i < 5) {
                        imgTemp.width = realImageWidth * (i + 1);
                        imgTemp.height = realImageHeight * (i + 1);
                    } else {
                        imgTemp.width = realImageWidth * (i + 20);
                        imgTemp.height = realImageHeight * (i + 20);

                    }


                    standardImgs[i] = imgTemp;

                    console.log(standardImgs[i].width + "  x  " + standardImgs[i].height);

                    //console.log(standardImgs[i].src);
                    //standardImgs[i].width = realImageWidth * (i + 1);
                    //standardImgs[i].height = realImageHeight * (i + 1);


                    //console.log("hi " + standardImgs[i]);
                }

                toggleArray[0] = (standardImgs);

                /*
                                // initialize
                                magnifiedlImageEle.src = standardImgs[1].src;

                                magnifiedlImageEle.width = standardImgs[1].width;
                                magnifiedlImageEle.height = standardImgs[1].height;


                                magnificationFactor = 2;
                */


                //magnifiedlImageEle.src = copyOfOrigImage.src;

                //magnifiedlImageEle.width = realImageWidth * 2;
                //magnifiedlImageEle.height = realImageHeight * 2;

            };


            //magnifierPageDiv.appendChild(img);
        }


        reader.readAsDataURL(file);





        //var reader = new FileReader();
        //reader.addEventListener("loadend", function (event) {
        //    console.log(event.target.result);
        //});
        //reader.readAsText(file);
        /*
                console.log("hi");

                if (file.type.match('image.*')) {
                    console.log("is an image");
                    //console.log("Show type of image: ", file.type.split("/")[1]);
                } else {
                    console.log("not image file");
                    alert("not an image");
                }
        */
        console.log(file.name + "  :  " + file.size);



        originalImageEle.src = URL.createObjectURL(file);


        //magnifiedlImageEle.src = URL.createObjectURL(file);


        return done();
    },
    init: function () {
        this.on('success', function (file, resp) {
            console.log(file);
            console.log(resp);


            imageNameEle.innerHTML = "NAME:  " + file.name;
            imageSizeEle.innerHTML = "SIZE:  " + Math.round(file.size / 1000) + " KB";

            //console.log(file.name);
            //console.log(Math.round(file.size / 1000));

        });
        this.on("complete", function (file) {

            if (this.getRejectedFiles().length > 0) {
                alert("The file needs to be an image! Try Again");
            }

            this.removeAllFiles(file);


            scaledImageWidth = originalImageEle.width;
            scaledImageHeight = originalImageEle.height;

            var xTransform = ((magnifiedImageContainerDiv.offsetWidth - magnifiedlImageEle.width - 7) / 2);
            var yTransform = ((magnifiedImageContainerDiv.offsetHeight - magnifiedlImageEle.height - 8) / 2);

            magnifiedlImageEle.style["webkitTransform"] = "translate(" + xTransform + "px," + yTransform + "px)";


            magnifiedlImageEle.style["display"] = "none";


            //this.disable();
        });
    }
};

// --------------------------------------------------------------------------------------------------------
// Socket (drag and drop file)

var socket = io.connect('http://localhost:4200');

socket.on('connect', function () {
    console.log("connected to server ...");

    /*
        var delivery = new Delivery(socket);

        delivery.on('receive.start', function (fileUID) {
            console.log('receiving a file!');
        });

        delivery.on('receive.success', function (file) {
            //var params = file.params;
            //if (file.isImage()) {
            //    $('img').attr('src', file.dataURL());
            //};
            console.log("clietn receied vjkevdfvhlvjc");
        });
    */


});

socket.on('fileGenerated', function (data) {
    console.log("[Client] file generated : ", data);


    window.setTimeout(fromServerToClient, 3000);

    //magnifiedlImageEle.src = "/genImages/inPython.png";

    //magnifiedlImageEle.width = standardImgs[1].width;
    //magnifiedlImageEle.height = standardImgs[1].height;


});



/*
        socket.on('news', function(data) {
            var div = document.getElementById("news-list");
            console.log("Rendering news : ", data);

            for (var i = 0; i < data.length; i++) {
                var newsItem = data[i];
                div.innerHTML += "<h3>" + newsItem.title + ' <small>' + newsItem.date + "</small></h3><br>";
            }

            socket.emit('my other event', {
                my: 'data'
            });
        });
*/

// --------------------------------------------------------------------------------------------------------
// JS functions

function resizeElements() {

    //magnifiedlImageEle.style["left"] = (-magnifiedImageContainerDiv.width) + "px";

    //console.log(originalImageEle.width + "  x  " + originalImageEle.height);

    // window

    //if (window.innerWidth < 500 || window.innerHeight < 500) {
    //    console.log("too small");
    //    window.resizeTo(500, 500);
    //}

    //magnifiedlImageEle.style["left"] = Math.round((magnifiedImageContainerDiv.offsetWidth - magnifiedlImageEle.width) / 2) + "px";

    //var num = -55;
    //console.log(num.map(0, 10, 0, 100));

    /*
        console.log("------------------------------------------------------------------");

        console.log("copy of orig image");
        console.log(copyOfOrigImage.width + "  x  " + copyOfOrigImage.height);

        console.log("magnified image element");
        console.log(magnifiedlImageEle.width + "  x  " + magnifiedlImageEle.height);

        console.log("original image element");
        console.log(originalImageEle.width + "  x  " + originalImageEle.height);

    */

    scaledImageWidth = originalImageEle.width;
    scaledImageHeight = originalImageEle.height;


    // center
    var xTransform = ((magnifiedImageContainerDiv.offsetWidth - magnifiedlImageEle.width - 7) / 2);
    var yTransform = ((magnifiedImageContainerDiv.offsetHeight - magnifiedlImageEle.height - 8) / 2);

    magnifiedlImageEle.style["webkitTransform"] = "translate(" + xTransform + "px," + yTransform + "px)";



    idealResEle.innerHTML = originalImageContainerDiv.offsetWidth + " x " + originalImageContainerDiv.offsetHeight;

    //magnifiedlImageEle.style.transform = "translate(-10px,0px)";







}

function onImageMouseMove(event) {

    if (event.offsetX >= 0 && event.offsetY >= 0) {
        //console.log("what");
        //console.log(event.offsetX + "    " + event.offsetY);

        //(event.offsetY - magnifiedlImageEle.height / 2)


        //xMouse = event.offsetX.map(0, scaledImageWidth, 0, realImageWidth);
        //yMouse = event.offsetY.map(0, scaledImageHeight, 0, realImageHeight);

        xMouseRaw = event.offsetX;
        yMouseRaw = event.offsetY;


        //xMouse = event.offsetX.map(0, scaledImageWidth, 0, magnifiedlImageEle.width);
        //yMouse = event.offsetY.map(0, scaledImageHeight, 0, magnifiedlImageEle.height);

        calculateTransformations();

    }
}

function calculateTransformations() {


    xMouse = xMouseRaw.map(0, scaledImageWidth, 0, magnifiedlImageEle.width);
    yMouse = yMouseRaw.map(0, scaledImageHeight, 0, magnifiedlImageEle.height);

    var xTransform = ((magnifiedImageContainerDiv.offsetWidth - magnifiedlImageEle.width - 7) / 2);
    var yTransform = ((magnifiedImageContainerDiv.offsetHeight - magnifiedlImageEle.height - 8) / 2);

    //magnifiedlImageEle.style["transform"] = "translate(" + xTransform + "px," + yTransform + "px)";

    magnifiedlImageEle.style["webkitTransform"] = "translate(" + (0 - ((xMouse - magnifiedlImageEle.width / 2) - xTransform)) + "px," + (0 - ((yMouse - magnifiedlImageEle.height / 2) - yTransform)) + "px)";
    //magnifiedlImageEle.style["webkitTransform"] = "translateY(" + (0 - ((event.offsetY - magnifiedlImageEle.height / 2) - yTransform)) + "px)";


    //magnifiedlImageEle.style.transform = "translate(" + (magnifiedImageContainerDiv.width - magnifiedlImageEle.width) + "px, 0px)";
    //magnifiedlImageEle.style.transform = "translateY(" + (event.offsetY - magnifiedlImageEle.height) + "px)";

}

function onImageMouseEnter() {

    magnifiedlImageEle.style["display"] = "block";
    magFactorEle.style["display"] = "block";
    imageInfoEle.style["display"] = "none";

    imageModeEle.style["display"] = "block";




}

function onImageMouseLeave() {

    magnifiedlImageEle.style["display"] = "none";
    magFactorEle.style["display"] = "none";
    imageInfoEle.style["display"] = "block";

    imageModeEle.style["display"] = "none";

}

var toggleMode = 1;
imageModeEle.innerHTML = "Magnification Mode: Super Res";
imageModeEle.style["display"] = "none";

function handleKeyPress(event) {


    //console.log(event.key);

    if (imageUploaded == true) {
        if (event.key == "]") {

            magnificationFactor++;

            if (magnificationFactor > standardImgs.length)
                magnificationFactor--;
            else {


                var tempArray = toggleArray[toggleMode];

                //console.log(tempArray[0].width);


                magnifiedlImageEle.src = tempArray[magnificationFactor - 1].src;

                magnifiedlImageEle.width = tempArray[magnificationFactor - 1].width;
                magnifiedlImageEle.height = tempArray[magnificationFactor - 1].height;

                calculateTransformations();

                console.log("zoom in: " + magnificationFactor + " x");

                magFactorEle.innerHTML = "x " + magnificationFactor;
            }


        } else if (event.key == "[") {

            magnificationFactor--;

            if (magnificationFactor < 2)
                magnificationFactor++;
            else {


                var tempArray = toggleArray[toggleMode];


                magnifiedlImageEle.src = tempArray[magnificationFactor - 1].src;

                magnifiedlImageEle.width = tempArray[magnificationFactor - 1].width;
                magnifiedlImageEle.height = tempArray[magnificationFactor - 1].height;

                calculateTransformations();

                console.log("zoom out: " + magnificationFactor + " x");

                magFactorEle.innerHTML = "x " + magnificationFactor;
            }
        }

        if (event.key == "s") {

            console.log("toggling mode : " + toggleMode);



            if (toggleMode) {
                toggleMode = 0;
                imageModeEle.innerHTML = "Magnification Mode: Standard";
            } else {
                toggleMode = 1;
                imageModeEle.innerHTML = "Magnification Mode: Super Res";
            }



            var tempArray = toggleArray[toggleMode];


            magnifiedlImageEle.src = tempArray[magnificationFactor - 1].src;

            magnifiedlImageEle.width = tempArray[magnificationFactor - 1].width;
            magnifiedlImageEle.height = tempArray[magnificationFactor - 1].height;

            calculateTransformations();



        }
    }


}


Number.prototype.map = function (in_min, in_max, out_min, out_max) {

    var input = this;

    if (input < in_min)
        input = in_min;
    else if (input > in_max)
        input = in_max;


    return Math.round((input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}
