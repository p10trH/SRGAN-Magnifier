# conversion code adapted from https://github.com/niektemme/tensorflow-mnist-predict/
#
# ...to run, "python3 convertImage.py anyImage.png"

import sys

from PIL import Image, ImageFilter

def convert_image(argv): #returns list of pixel data
    # load source image, convert to black and white (mode 'L')
    sourceImage = Image.open(argv).convert('L')

    width = float(sourceImage.size[0])
    height = float(sourceImage.size[1])

    # create a white canvas, 28x28 pixels
    whiteCanvas = Image.new('L', (int(width), int(height)), (255))
    whiteCanvas.paste(sourceImage, (0, 0))
  
    fileName = "inPython.png"
    whiteCanvas.save("genImages/" + fileName)

    # store pixel data in list
    pixelValues = list(whiteCanvas.getdata())
    
    # normalize pixels, 0 is white, 1 is black
    pixelValues_normalized = [(255-x)*1.0/255.0 for x in pixelValues] 
    
    return pixelValues_normalized

def main(argv):

    # input: png file location
    # pixels is a list of returned pixel data
    pixels = convert_image(argv)
    
    print (argv)
    #print(pixels)
    #print ("\ndone\n")
    
if __name__ == "__main__":
    main(sys.argv[1])