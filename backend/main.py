from fastapi import FastAPI, UploadFile, File
from ai_module.pipeline import process_resume
import os

app = FastAPI()

@app.post("/upload-resume")
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), role: str = "general"):

    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(await file.read())

    result = process_resume(file_location, role)

    os.remove(file_location)

    return {
        "filename": file.filename,
        "data": result,
        "status": "success"
    }