"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import LoadingSpinner from "@/components/LoadingSpinner";
import { analyzeDocument } from "@/lib/api";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await analyzeDocument(file);
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      sessionStorage.setItem("fileName", file.name);
      router.push("/results");
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🔬</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Research Portal
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Upload an earnings call transcript or management commentary to get an
          instant AI-powered analysis.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <FileUpload onUpload={handleUpload} isLoading={isLoading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 mt-6 text-center max-w-sm">
        Supported format: PDF · Max size: 10MB · Powered by Gemini 2.0 Flash
      </p>
    </main>
  );
}
