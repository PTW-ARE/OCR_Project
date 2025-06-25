import DisplayIMG from "./components/DisplayIMG";
import DisplayPDF from "./components/DisplayPDF";
import useUploadFile from "./hook/useUploadFile";

function App() {
  const { previewURL, fileName, ocrResult, handleFileChange, uploadFile } =
    useUploadFile();

  const renderPreview = () => {
    if (!previewURL) return null;
    if (fileName.toLowerCase().endsWith(".pdf")) {
      return <DisplayPDF previewURL={previewURL} />;
    } else {
      return <DisplayIMG previewURL={previewURL} />;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex min-h-[80dvh] min-w-[60dvh] flex-col justify-between overflow-y-auto rounded-xl border border-gray-300 bg-white p-5 text-center shadow-xl">
        {/* ส่วนเนื้อหา */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">อัปโหลดไฟล์</h2>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="mb-4 w-full max-w-70 rounded border border-gray-300 bg-gray-200 p-2 text-center transition duration-300 hover:bg-gray-500"
          />
          <p className="my-2 text-sm text-black">{fileName}</p>

          {renderPreview()}

          {ocrResult && (
            <div className="mt-4 max-h-60 overflow-y-auto rounded border border-gray-300 bg-gray-100 p-4 text-left whitespace-pre-wrap text-black">
              <h3 className="mb-2 text-lg font-semibold">ผลลัพธ์ OCR</h3>
              <p>{ocrResult}</p>
            </div>
          )}
        </div>

        <button
          onClick={uploadFile}
          className="rounded bg-green-600 px-6 py-2 text-xl text-white transition hover:bg-green-700"
        >
          ส่งไป OCR
        </button>
      </div>
    </div>
  );
}

export default App;
