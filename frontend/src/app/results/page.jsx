"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SummaryCard from "@/components/SummaryCard";
import KeyPoints from "@/components/KeyPoints";

export default function ResultsPage() {
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    const name = sessionStorage.getItem("fileName");
    if (!stored) {
      router.push("/");
      return;
    }
    setResult(JSON.parse(stored));
    setFileName(name || "Document");
  }, []);

  if (!result) return null;

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analysis Results
            </h1>
            <p className="text-sm text-gray-400 mt-1 truncate max-w-xs">
              📄 {fileName}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Analyze another
          </button>
        </div>

        {/* Tone + Confidence */}
        <SummaryCard
          tone={result.tone}
          confidence_level={result.confidence_level}
        />

        {/* Forward Guidance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="font-bold text-gray-800">Forward Guidance</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {result.forward_guidance || "Not mentioned in document"}
          </p>
        </div>

        {/* Capacity Utilization */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="font-bold text-gray-800">Capacity Utilization</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {result.capacity_utilization || "Not mentioned in document"}
          </p>
        </div>

        {/* Key Points */}
        <KeyPoints
          key_positives={result.key_positives}
          key_concerns={result.key_concerns}
          growth_initiatives={result.growth_initiatives}
        />

        {/* Disclaimer */}
        {result.disclaimer &&
          result.disclaimer !== "Not mentioned in document" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Analyst Note
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {result.disclaimer}
                </p>
              </div>
            </div>
          )}

        {/* Analyze another button */}
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all active:scale-95"
        >
          Analyze Another Document
        </button>
      </div>
    </main>
  );
}
