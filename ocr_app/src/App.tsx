import DisplayIMG from "./components/DisplayIMG";
import DisplayPDF from "./components/DisplayPDF";
import useUploadFile from "./hook/useUploadFile";

function App() {
  const {
    previewURL,
    fileName,
    ocrResult,
    rawTextResult,
    showRawText,
    toggleRawText,
    handleFileChange,
    uploadFile,
    exportToExcel,
    loading,
  } = useUploadFile();

  const renderPreview = () => {
    if (!previewURL) return null;
    if (fileName.toLowerCase().endsWith(".pdf")) {
      return <DisplayPDF previewURL={previewURL} />;
    } else {
      return <DisplayIMG previewURL={previewURL} />;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-700 p-8">
      <div className="flex max-h-[80vh] min-h-[80vh] min-w-[60vh] flex-col justify-between overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-6 text-center shadow-2xl">
        <div>
          <h2 className="mb-6 text-3xl font-extrabold text-indigo-400">
            Upload File
          </h2>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="mb-6 w-full max-w-72 rounded border border-gray-700 bg-gray-800 p-3 text-center text-gray-300 transition duration-300 hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-700"
            disabled={loading}
          />
          <p className="my-3 text-sm font-medium text-gray-300">{fileName}</p>

          {renderPreview()}
        </div>

        <button
          onClick={uploadFile}
          disabled={!previewURL || loading}
          className={`mx-auto rounded-lg px-8 py-3 text-xl font-semibold text-white transition-shadow duration-300 ${
            loading
              ? "cursor-not-allowed bg-gray-600 shadow-none"
              : "bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 hover:from-purple-800 hover:via-indigo-800 hover:to-blue-900 hover:shadow-lg"
          }`}
        >
          {loading ? "Loading..." : "RUN"}
        </button>
      </div>

      <div className="ml-12 flex max-h-[80vh] min-h-[80vh] w-[800px] flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-6 text-center shadow-2xl">

        <div className="relative mb-6 flex items-center justify-center">
          <h2 className="text-3xl font-extrabold text-indigo-400">Result</h2>

          {(ocrResult || rawTextResult) && (
            <button
              onClick={toggleRawText}
              disabled={loading}
              className={`absolute top-0 right-0 rounded-md border border-indigo-600 bg-indigo-800 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 ${
                loading
                  ? "cursor-not-allowed opacity-50 hover:bg-indigo-800"
                  : ""
              }`}
            >
              {showRawText ? "Show Formatted" : "Show Raw Text"}
            </button>
          )}
        </div>

        {ocrResult || rawTextResult ? (
          <div className="mb-4 flex-grow overflow-y-auto rounded border border-gray-700 bg-gray-800 p-5 text-left whitespace-pre-wrap text-gray-300 shadow-inner">
            <p className="mt-0">{showRawText ? rawTextResult : ocrResult}</p>
          </div>
        ) : (
          <div className="mb-4 flex-grow rounded border border-gray-700 bg-gray-800 p-5 text-left text-gray-500" />
        )}

        <button
          onClick={exportToExcel}
          disabled={!ocrResult || loading}
          className={`mx-auto rounded-lg px-8 py-3 text-xl font-semibold text-white transition-shadow duration-300 ${
            !ocrResult || loading
              ? "cursor-not-allowed bg-gray-600 shadow-none"
              : "bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 hover:shadow-lg"
          }`}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default App;
