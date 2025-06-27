# 📄 OCR Document Extractor

โปรเจกต์นี้เป็นระบบ OCR สำหรับอัปโหลดภาพหรือ PDF เพื่อดึงข้อมูลสำคัญ เช่น หมายเลขพัสดุ, ชื่อผู้รับ, เบอร์โทร, ที่อยู่ และรหัสไปรษณีย์ พร้อมฟีเจอร์ Export ข้อมูลเป็น Excel และดู Raw Text ได้

---

## 🔧 Features

- ✅ รองรับไฟล์ PDF และรูปภาพ
- 🧠 วิเคราะห์ข้อมูลด้วย OCR (ผ่าน Typhoon API)
- 📋 แสดงผลแบบจัดรูปและแบบ Raw
- 📤 Export ข้อมูลเป็น Excel
- ⚡ UI เรียบง่ายด้วย React + Tailwind CSS
- 🔁 สลับโหมดแสดงผลได้ทันที

---

## 🖥️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **OCR Engine**: Typhoon OCR API
- **File Conversion**: `pdf2image`, `Pillow`
- **Excel Export**: `xlsx`, `file-saver`

### 1. เตรียม Backend

#### ติดตั้ง dependency

```bash
cd backend
pip install -r requirements.txt
```

#### สร้าง `.env` และใส่ API Key

OPENAI_API_KEY=your_typhoon_api_key_here

### 2. รัน FastAPI

uvicorn main:app --reload

### 3. รัน Frontend

cd frontend
npm install
npm run dev


## วิธีใช้งาน

1. เลือกไฟล์ PDF หรือรูปภาพ
2. กดปุ่ม **RUN**
3. เลือกดูผลแบบ "Formatted" หรือ "Raw Text"
4. คลิก **Export to Excel** เพื่อบันทึกข้อมูล

## หมายเหตุ

* OCR จะทำงานต่อหน้าแบบ page-by-page สำหรับไฟล์ PDF
* ต้องเชื่อมต่ออินเทอร์เน็ตขณะใช้งาน (ใช้ Typhoon API)
* ไฟล์รูปควรชัดเจน เพื่อผลลัพธ์ที่แม่นยำ
