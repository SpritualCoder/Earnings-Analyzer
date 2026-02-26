export default function LoadingSpinner({ message = "Analyzing document..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>

      {/* Message */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-lg font-semibold text-gray-700">{message}</p>
        <p className="text-sm text-gray-400">
          This may take a few seconds depending on document size
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {[
          { icon: "📄", label: "Extracting text from PDF" },
          { icon: "🔍", label: "Running OCR if needed" },
          { icon: "🤖", label: "Analyzing with Gemini AI" },
          { icon: "📊", label: "Structuring results" },
        ].map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 animate-pulse"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <span className="text-lg">{step.icon}</span>
            <p className="text-sm text-gray-500">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
