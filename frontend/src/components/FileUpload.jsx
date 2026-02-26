import { useState, useRef } from "react";

export default function FileUpload({ onUpload, isLoading }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File size must be under 20MB.");
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    setError("");
    if (!validateFile(file)) return;
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    onUpload(selectedFile);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Drop Zone */}
      <div
        onClick={() => !selectedFile && inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
          ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"}
          ${selectedFile ? "cursor-default" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleInputChange}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl">📄</div>
            <p className="font-medium text-gray-800">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-sm text-red-500 hover:underline mt-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <div className="text-4xl">☁️</div>
            <p className="font-medium">Drag & drop your PDF here</p>
            <p className="text-sm">or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">PDF only · Max 20MB</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className={`
          w-full py-3 rounded-xl font-semibold text-white transition-all
          ${
            !selectedFile || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Analyzing...
          </span>
        ) : (
          "Analyze Document"
        )}
      </button>
    </div>
  );
}
