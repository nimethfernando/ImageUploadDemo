from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import io
from PIL import Image
import torch

# Import DeOldify colorizer
from deoldify.visualize import get_image_colorizer

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize colorizer (do this once)
colorizer = get_image_colorizer(artistic=True)

@app.post("/colorize")
async def colorize_image(file: UploadFile = File(...)):
    try:
        # Save uploaded image to disk (DeOldify works with file paths)
        contents = await file.read()
        input_path = "input_image.jpg"
        output_path = "output_image.jpg"
        with open(input_path, "wb") as f:
            f.write(contents)

        # Colorize using DeOldify
        colorizer.plot_transformed_image(
            path=input_path,
            results_dir=".",
            render_factor=35,
            display_render_factor=False,
            figsize=(8,8)
        )

        # Read the colorized image and return as response
        with open(output_path, "rb") as out_img:
            img_bytes = out_img.read()
        return Response(content=img_bytes, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
