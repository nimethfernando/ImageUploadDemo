from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import io
from PIL import Image

# Initialize app
app = FastAPI()

# CORS Configuration (important for React connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/colorize")
async def colorize_image(file: UploadFile = File(...)):
    try:
        # 1. Read uploaded file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # 2. Colorization logic (replace with actual model)
        # For DeOldify: use visualize.get_image_colorizer()
        # For other models: add your inference code
        
        # 3. Return colorized image
        buf = io.BytesIO()
        image.save(buf, format="JPEG")  # Replace with actual colorized image
        return Response(content=buf.getvalue(), media_type="image/jpeg")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))