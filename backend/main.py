import traceback
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
from dotenv import load_dotenv
import os
from tempfile import NamedTemporaryFile
from pdf2image import convert_from_bytes
from typhoon_ocr import ocr_document
from extract_utils import extract_fields

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TYPHOON_API_KEY = os.getenv("OPENAI_API_KEY")

# @app.post("/ocr")
# async def ocr_endpoint(
#     file: UploadFile = File(...),
#     task_type: str = Form("default"),
    
# ):
#     try:

#         suffix = os.path.splitext(file.filename)[-1]
#         with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#             shutil.copyfileobj(file.file, tmp)
#             temp_file_path = tmp.name


#         markdown_result = ocr_document(
#             pdf_or_image_path=temp_file_path,
#             task_type=task_type,
#             api_key=TYPHOON_API_KEY
            
#         )
#         os.remove(temp_file_path)
        
#         extracted_data = extract_fields(markdown_result)

#         result_text = ""

#         
#         if extracted_data.get("tracking_numbers"):
#             result_text += "\n".join(f"หมายเลขพัสดุ: {tn}" for tn in extracted_data["tracking_numbers"])
#             result_text += "\n"
            
#         if extracted_data.get("phone_matches"):
#             result_text += "\n".join(f"เบอร์โทร: {tn}" for tn in extracted_data["phone_matches"])
#             result_text += "\n"

#         if extracted_data.get("name_matches"):
#             result_text += "\n".join(f"ชื่อผู้รับ: {tn}" for tn in extracted_data["name_matches"])
#             result_text += "\n"
            
#         if extracted_data.get("address_matches"):
#             result_text += "\n".join(f"ที่อยู่ผู้รับ: {tn}" for tn in extracted_data["address_matches"])
#             result_text += "\n"
            
#         if extracted_data.get("zipcode_matches"):
#             result_text += "\n".join(f"รหัสไปรษณีย์: {tn}" for tn in extracted_data["zipcode_matches"])
#             result_text += "\n"
        

#         return {"result": result_text}
    
#         # return {"result": markdown_result}

#     except Exception as e:
#         print("[ERROR]", str(e))
#         traceback.print_exc()
#         return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/ocr")
async def ocr_endpoint(
    file: UploadFile = File(...),
    task_type: str = Form("default"),
):
    try:
        suffix = os.path.splitext(file.filename)[-1].lower()
        page_results = []


        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        if suffix == ".pdf":

            images = convert_from_bytes(open(temp_path, "rb").read(), dpi=300)

            for i, img in enumerate(images):
                with NamedTemporaryFile(delete=False, suffix=".png") as img_tmp:
                    img.save(img_tmp.name, format="PNG")
                    img_tmp_path = img_tmp.name


                page_text = ocr_document(
                    pdf_or_image_path=img_tmp_path,
                    task_type=task_type,
                    api_key=TYPHOON_API_KEY,
                )

                fields = extract_fields(page_text)

                page_results.append({
                    "page": i + 1,
                    "rawtext": page_text,
                    "fields": fields
                })

                os.remove(img_tmp_path)

        else:
            
            page_text = ocr_document(
                pdf_or_image_path=temp_path,
                task_type=task_type,
                api_key=TYPHOON_API_KEY,
            )
            fields = extract_fields(page_text)
            page_results.append({
                "page": 1,
                "rawtext": page_text,
                "fields": fields
            })

        os.remove(temp_path)

        return JSONResponse(content={"page_results": page_results})

    except Exception as e:
        print("[ERROR]", str(e))
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})