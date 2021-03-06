# -*- coding: utf-8 -*-

import argparse
import os, sys
import sugartensor as tf
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageFilter
import numpy as np

def convert_image(argv): #returns list of pixel data
    # load source image, convert to black and white (mode 'L')
    sourceImage = Image.open(argv).convert('L')

    width = float(sourceImage.size[0])
    height = float(sourceImage.size[1])

    # create a white canvas, 28x28 pixels
    whiteCanvas = Image.new('L', (int(width), int(height)), (0))
    whiteCanvas.paste(sourceImage, (0, 0))
  
    #fileName = "inPython.png"
    #whiteCanvas.save(fileName)

    # store pixel data in list
    pixelValues = list(whiteCanvas.getdata())
    
    # normalize pixels, 0 is white, 1 is black
    pixelValues_normalized = [(255-x)*1.0/255.0 for x in pixelValues] 
    
    return pixelValues_normalized



def main(argv):
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

	

	pngName = argv

	png = tf.read_file(pngName)
	#png.thumbnail(size, Image.ANTIALIAS)
	#png = tf.resize(png1, (14,14))
	myPNG = tf.image.decode_png(png)

	y = convert_image(pngName)
	x = tf.reshape(y, [1,28,28,1])

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
	fileName = "inPython.png"
	fig_name = "genImages/" + fileName
	#fig_name2 = 'asset/train/sample2.png'

	print("start")
	with tf.Session() as sess:
	    with tf.sg_queue_context(sess):

	        tf.sg_init(sess)

	        # restore parameters
	        saver = tf.train.Saver()
	        #saver.restore(sess, tf.train.latest_checkpoint('asset/train/ckpt'))
	        saver.restore(sess, tf.train.latest_checkpoint('python/asset/train/ckpt'))

	        # run generator
	        gt, low, bicubic, sr = sess.run([x.sg_squeeze(), x_nearest, x_bicubic, gen])
	        

	        # plot result
		#sr[0].thumbnail(size, Image.ANTIALIAS)
		plt.figure(figsize=(1,1))
		#plt.set_axis_off()	
	        hr = plt.imshow(sr[0], 'gray' )
		plt.axis('tight')
		plt.axis('off')	
	        #ax.set_axis_off()
		#ax.thumbnail(size, Image.ANTIALIAS)
	        

	        #plt.savefig(fig_name,bbox_inches='tight',pad_inches=0,dpi=600)
	    plt.savefig(fig_name,dpi=600)
	        #tf.sg_info('Sample image saved to "%s"' % fig_name)
	    plt.close()

	    ##print (type (sr[0]))
	    ##sourceImage = Image.fromarray(np.uint8(sr[0])

    	print("done")



if __name__ == "__main__":
    main(sys.argv[1])

