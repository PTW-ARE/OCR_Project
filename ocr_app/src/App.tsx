import { useEffect, useState } from 'react'
import Header from './component/Header'

function App() {

    const [showModal, setShowModal] = useState(false)
    const [previewURL, setPreviewURL] = useState<string | null>(null)
    const [fileName, setFileName] = useState('')

    const [ocrResult, setOcrResult] = useState<string>('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {

            const isImage = file.type.startsWith('image/')
            const isPDF = file.type === 'application/pdf'

            if (!isImage && !isPDF) {
                alert('รองรับเฉพาะไฟล์ภาพ (jpg, png ฯลฯ) และ PDF เท่านั้น')
                return
            }

            setFileName(file.name)
            setPreviewURL(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        return () => {
            if (previewURL) {
                URL.revokeObjectURL(previewURL);
            }
        };
    }, [previewURL]);

    const uploadFile = async () => {
        if (!previewURL) return;

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (!fileInput?.files?.length) return;

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/ocr', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setOcrResult(data.result);
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาดในการส่งไฟล์');
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setPreviewURL(null)
        setFileName('')
    }

    const renderPreview = () => {
        if (!previewURL) return null

        if (fileName.endsWith('.pdf')) {
            return (
                <embed
                    src={previewURL}
                    type="application/pdf"
                    className="w-full h-[450px] rounded shadow "
                />
            )
        } else {
            return (
                <img
                    src={previewURL}
                    alt="Preview"
                    className="w-80 h-110 mx-auto rounded shadow"
                />
            )
        }
    }

    return (

        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center">

            {/* ปุ่ม Start */}
            {!showModal && (
                <button
                    onClick={() => setShowModal(true)}
                    className="px-10 py-5 bg-red-600 text-2xl text-white rounded-xl shadow-md hover:bg-red-700 transition duration-300"
                >
                    Start
                </button>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-5 w-full max-w-xl h-4/5 rounded-xl border border-gray-300 shadow-xl text-center overflow-y-auto flex flex-col justify-between">

                        {/* ส่วนเนื้อหา */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">อัปโหลดไฟล์</h2>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                className="bg-gray-200 max-w-70 mb-4 text-center border border-gray-300 rounded p-2 hover:bg-gray-500 transition duration-300 w-full"
                            />
                            <p className="text-sm text-black my-2">{fileName}</p>
                            {renderPreview()}

                            {ocrResult && (
                                <div className="text-left p-4 bg-gray-100 border border-gray-300 rounded mt-4 max-h-60 overflow-y-auto whitespace-pre-wrap text-black">
                                    <h3 className="text-lg font-semibold mb-2">ผลลัพธ์ OCR</h3>
                                    <p>{ocrResult}</p>
                                </div>
                            )}

                        </div>

                        {/* ปุ่ม Close อยู่ล่าง */}
                        <div className="mt-4">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-red-600 text-white text-xl rounded hover:bg-red-700 transition"
                            >
                                Close
                            </button>

                            <button
                                onClick={uploadFile}
                                className="px-6 py-2 bg-green-600 text-white text-xl rounded hover:bg-green-700 transition"
                            >
                                ส่งไป OCR
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default App
