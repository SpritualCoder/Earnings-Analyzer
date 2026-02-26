const TONE_CONFIG = {
  optimistic: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: "📈",
  },
  cautious: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: "⚠️",
  },
  neutral: {
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: "➖",
  },
  pessimistic: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: "📉",
  },
};

const CONFIDENCE_CONFIG = {
  high: {
    color: "bg-green-100 text-green-700",
    dots: [true, true, true],
  },
  medium: {
    color: "bg-yellow-100 text-yellow-700",
    dots: [true, true, false],
  },
  low: {
    color: "bg-red-100 text-red-700",
    dots: [true, false, false],
  },
};

export default function SummaryCard({ tone, confidence_level }) {
  const toneKey = tone?.toLowerCase();
  const confidenceKey = confidence_level?.toLowerCase();

  const toneConfig = TONE_CONFIG[toneKey] || TONE_CONFIG["neutral"];
  const confidenceConfig =
    CONFIDENCE_CONFIG[confidenceKey] || CONFIDENCE_CONFIG["medium"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Tone Card */}
      <div
        className={`rounded-xl border-2 p-5 flex flex-col gap-2 ${toneConfig.color}`}
      >
        <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
          Management Tone
        </p>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{toneConfig.icon}</span>
          <span className="text-xl font-bold capitalize">{tone || "N/A"}</span>
        </div>
      </div>

      {/* Confidence Card */}
      <div
        className={`rounded-xl border-2 border-transparent p-5 flex flex-col gap-2 ${confidenceConfig.color}`}
      >
        <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
          Confidence Level
        </p>
        <div className="flex items-center gap-3">
          {/* Dot indicator */}
          <div className="flex gap-1">
            {confidenceConfig.dots.map((filled, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 ${
                  filled
                    ? "bg-current border-current"
                    : "bg-transparent border-current opacity-30"
                }`}
              />
            ))}
          </div>
          <span className="text-xl font-bold capitalize">
            {confidence_level || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
