# -*- coding: utf-8 -*-

import argparse
import os, sys
import sugartensor as tf
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageFilter

def convert_image(argv): #returns list of pixel data

  # load source image, convert to black and white (mode 'L')
  sourceImage = Image.open(argv).convert('L')

  width = float(sourceImage.size[0])
  height = float(sourceImage.size[1])

  # create a white canvas, 28x28 pixels
  whiteCanvas = Image.new('L', (28, 28), (255))
  
  # check which side is longer
  if (width > height):

    # if true, width becomes 20 pixels, scale height according to width
    newHeight = int(round((20.0/width*height),0))
    
    # check rare case
    if (newHeight == 0):
      newHeight = 1  

    # resize and sharpen
    newImage = sourceImage.resize((20,newHeight), Image.ANTIALIAS).filter(ImageFilter.SHARPEN)

    # find position for centering
    yPosition = int(round(((28-newHeight)/2),0))

    # paste resized image on white canvas
    whiteCanvas.paste(newImage, (4, yPosition))

  else:

    # if true, height becomes 20 pixels, scale width according to height
    newWidth = int(round((20.0/height*width),0))

    # check rare case
    if (newWidth == 0):
      newWidth = 1

    # resize and sharpen
    newImage = sourceImage.resize((newWidth,20), Image.ANTIALIAS).filter(ImageFilter.SHARPEN)

    # find position for centering
    xPosition = int(round(((28 - newWidth)/2),0))

    # paste resized image on white canvas
    whiteCanvas.paste(newImage, (xPosition, 4))
  
  #whiteCanvas.save("sample.png")

  # store pixel data in list
  pixelValues = list(whiteCanvas.getdata())
  
  # normalize pixels, 0 is white, 1 is black
  pixelValues_normalized = [(255-x)*1.0/255.0 for x in pixelValues] 

  return pixelValues_normalized


# set log level to debug
tf.sg_verbosity(10)

#
# hyper parameters
#

size = 160, 147
batch_size = 1   # batch size

#
# inputs
#

# MNIST input tensor ( with QueueRunner )
data = tf.sg_data.Mnist(batch_size=batch_size)
print("data:")
print(data)
# input images
xy = data.train.image
print("x:")
print(xy)
#mypng = Image.open("sample.png")
#png = mypng.convert('RGB')

pngName = 'sample.png'

png = tf.read_file(pngName)
#png.thumbnail(size, Image.ANTIALIAS)
#png = tf.resize(png1, (14,14))
myPNG = tf.image.decode_png(png)
#myPNG = tf.image.resize_images(myPNG1,size)
#myPNG = tf.image.resize_bicubic(myPNG1, (14,14))
#zy = tf.expand_dims(myPNG,3)
#x = tf.reshape(myPNG, [1,28,28,1])
#y = tf.to_float(myPNG, name ='ToFloat')
#x = tf.reshape(y, [1,28,28,1])

y = convert_image('sample.png')
x = tf.reshape(y, [1,28,28,1])


print("y:")
print(x)
# corrupted image
x_small = tf.image.resize_bicubic(x, (14, 14))
x_bicubic = tf.image.resize_bicubic(x_small, (28, 28)).sg_squeeze()
x_nearest = tf.image.resize_images(x_small, (28, 28), tf.image.ResizeMethod.NEAREST_NEIGHBOR).sg_squeeze()

#
# create generator
#
# I've used ESPCN scheme
# http://www.cv-foundation.org/openaccess/content_cvpr_2016/papers/Shi_Real-Time_Single_Image_CVPR_2016_paper.pdf
#

# generator network
with tf.sg_context(name='generator', act='relu', bn=True):
    gen = (x 
	   .sg_conv(dim=32)
           .sg_conv()
           .sg_conv(dim=4, act='sigmoid', bn=False)
           .sg_periodic_shuffle(factor=2)
           .sg_squeeze())

#
# run generator
#

fig_name = 'asset/train/sample1.png'
fig_name2 = 'asset/train/sample2.png'
with tf.Session() as sess:
    with tf.sg_queue_context(sess):

        tf.sg_init(sess)

        # restore parameters
        saver = tf.train.Saver()
        saver.restore(sess, tf.train.latest_checkpoint('asset/train/ckpt'))


        # run generator
        gt, low, bicubic, sr = sess.run([x.sg_squeeze(), x_nearest, x_bicubic, gen])
        

        # plot result
	#sr[0].thumbnail(size, Image.ANTIALIAS)
	plt.figure(figsize=(4,3))
	#plt.set_axis_off()	
        hr = plt.imshow(sr[0], 'gray' )
	plt.axis('off')	
        #ax.set_axis_off()
	#ax.thumbnail(size, Image.ANTIALIAS)
        #for i in range(1):
            #for j in range(1):
                #ax[i][j*4].imshow(low[i*3+j], 'gray')
                #ax[i][j*4].set_axis_off()
                #ax[i][j*4+1].imshow(bicubic[i*3+j], 'gray')
                #ax[i][j*4+1].set_axis_off()
                #ax[i][j*4+2].imshow(sr[i*3+j], 'gray')
                #ax.imshow(sr[0], 'gray')
                #ax.set_axis_off()
                #ax[i][j*4+2].set_axis_off()
                #ax[i][j*4+3].imshow(gt[i*3+j], 'gray')
                #ax[i][j*4+3].set_axis_off()

        #plt.savefig(fig_name,bbox_inches='tight',dpi=300)
        plt.savefig(fig_name,dpi=600)
        tf.sg_info('Sample image saved to "%s"' % fig_name)
        plt.close()
 	
	plt.figure(figsize=(4,3))
        lr = plt.imshow(gt[0], 'gray' )
	plt.axis('off')	
        plt.savefig(fig_name2,dpi=600)
        tf.sg_info('Sample image saved to "%s"' % fig_name2)
        plt.close()
