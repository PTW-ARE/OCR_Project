from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # ✅ เพิ่ม
from typhoon_ocr import ocr_document
import shutil
import os
import uuid
import traceback

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # หรือ ["*"] ชั่วคราว (ไม่ปลอดภัย)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/ocr")
async def run_ocr(
    file: UploadFile = File(...),
    task_type: str = Form("default"),
    page_num: int = Form(None)
):
    temp_filename = f"{uuid.uuid4()}_{file.filename}"
    temp_path = os.path.join(UPLOAD_FOLDER, temp_filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = ocr_document(
            pdf_or_image_path=temp_path,
            task_type=task_type,
            page_num=page_num
        )
    except Exception as e:
        print("Error during OCR processing:")
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(temp_path)

    return {"result": result}
