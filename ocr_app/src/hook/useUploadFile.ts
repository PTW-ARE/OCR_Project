import React, { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type OCRFieldResult = {
  page: number;
  rawtext: string;
  fields: {
    tracking_numbers?: string[];
    phone_matches?: string[];
    name_matches?: string[];
    address_matches?: string[];
    zipcode_matches?: string[];
  };
};

export default function useUploadFile() {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [ocrResult, setOcrResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const [rawTextResult, setRawTextResult] = useState("");

  const toggleRawText = () => {
    setShowRawText((prev) => !prev);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";

      if (!isImage && !isPDF) {
        alert("รองรับเฉพาะไฟล์ภาพ (jpg, png ฯลฯ) และ PDF เท่านั้น");
        return;
      }

      setFileName(file.name);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const uploadFile = async () => {
    if (!previewURL) return "Add a File";

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (!fileInput?.files?.length) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("task_type", "default");

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      console.log(data);

      if (data.page_results && Array.isArray(data.page_results)) {
        const formatted = (data.page_results as OCRFieldResult[]).map(
          (pageResult) => {
            const { page, fields } = pageResult;

            const getValue = (values?: string[], label?: string) => {
              if (values && values.length > 0) {
                return values.map((v) => `${label}: ${v}`).join("\n");
              } else {
                return `${label}: ไม่ทราบ`;
              }
            };

            return (
              `หน้าที่ ${page}\n` +
              getValue(fields.tracking_numbers, "หมายเลขพัสดุ") +
              "\n" +
              getValue(fields.name_matches, "ชื่อผู้รับ") +
              "\n" +
              getValue(fields.address_matches, "ที่อยู่ผู้รับ") +
              "\n" +
              getValue(fields.phone_matches, "เบอร์โทร") +
              "\n" +
              getValue(fields.zipcode_matches, "รหัสไปรษณีย์") +
              "\n"
            );
          },
        );

        const rawTextCombined = (data.page_results as OCRFieldResult[])
          .map((p) => `หน้าที่ ${p.page}\n${p.rawtext}`)
          .join("\n\n");

        setRawTextResult(rawTextCombined);

        setLoading(false);
        setOcrResult(formatted.join("\n"));
      } else {
        setLoading(false);
        setOcrResult("ไม่พบข้อมูลจาก OCR");
      }

      // if (data.fields) {
      //   setOcrResult(data.fields);
      // } else if (data.result) {
      //   setOcrResult(data.result);
      // } else {
      //   setOcrResult("ไม่พบข้อมูลจาก OCR");
      // }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("เกิดข้อผิดพลาดในการส่งไฟล์");
    }
  };

  const exportToExcel = () => {
    if (!ocrResult) return;

    const pages = ocrResult.split(/\n(?=หน้าที่ \d+)/g);

    const data: { หน้า: string; หัวข้อ: string; ข้อมูล: string }[] = [];

    pages.forEach((pageBlock) => {
      const lines = pageBlock
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const pageLine = lines[0];
      const pageNum = pageLine.replace("หน้าที่ ", "");

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const [header, ...rest] = line.split(":");
        const value = rest.join(":").trim();

        data.push({
          หน้า: pageNum,
          หัวข้อ: header || "",
          ข้อมูล: value || "",
        });
      }
    });


    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OCR Result");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ocr_result.xlsx");
  };

  return {
    previewURL,
    setPreviewURL,
    fileName,
    setFileName,
    ocrResult,
    rawTextResult,
    showRawText,
    toggleRawText,
    setOcrResult,
    handleFileChange,
    uploadFile,
    exportToExcel,
    loading,
    setLoading,
  };
}
