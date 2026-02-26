const SECTION_CONFIG = {
  positives: {
    title: "Key Positives",
    icon: "✅",
    containerColor: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
    dotColor: "bg-green-500",
  },
  concerns: {
    title: "Key Concerns",
    icon: "🚨",
    containerColor: "bg-red-50 border-red-200",
    badgeColor: "bg-red-100 text-red-700",
    dotColor: "bg-red-500",
  },
  initiatives: {
    title: "Growth Initiatives",
    icon: "🚀",
    containerColor: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    dotColor: "bg-blue-500",
  },
};

function PointsList({ type, items }) {
  const config = SECTION_CONFIG[type];

  const isEmpty = !items || items.length === 0;

  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-3 ${config.containerColor}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <h3 className="font-bold text-gray-800">{config.title}</h3>
        </div>
        {!isEmpty && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${config.badgeColor}`}
          >
            {items.length} {items.length === 1 ? "point" : "points"}
          </span>
        )}
      </div>

      {/* Items */}
      {isEmpty ? (
        <p className="text-sm text-gray-400 italic">
          Not mentioned in document
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`mt-1.5 w-2 h-2 rounded-full flex shrink-0 ${config.dotColor}`}
              />
              <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function KeyPoints({
  key_positives,
  key_concerns,
  growth_initiatives,
}) {
  return (
    <div className="flex flex-col gap-4">
      <PointsList type="positives" items={key_positives} />
      <PointsList type="concerns" items={key_concerns} />
      <PointsList type="initiatives" items={growth_initiatives} />
    </div>
  );
}
