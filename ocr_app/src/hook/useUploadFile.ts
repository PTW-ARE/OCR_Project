import React, { useEffect, useState } from "react";

export default function useUploadFile() {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [ocrResult, setOcrResult] = useState<string>("");

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
    if (!previewURL) return;

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (!fileInput?.files?.length) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setOcrResult(data.result);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการส่งไฟล์");
    }
  };

  return {
    previewURL,
    setPreviewURL,
    fileName,
    setFileName,
    ocrResult,
    setOcrResult,
    handleFileChange,
    uploadFile,
  };
}
