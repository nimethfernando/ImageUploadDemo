from deoldify import visualize

def get_colorizer():
    return visualize.get_image_colorizer(artistic=True)

def colorize_image(image):
    colorizer = get_colorizer()
    return colorizer.get_transformed_image(image, render_factor=35)