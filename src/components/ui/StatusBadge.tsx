import { getSeverityColor, getStatusColor } from "@/lib/utils";

type StatusBadgeProps = {
  type: "severity" | "status";
  value: string;
};

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  const color = type === "severity" ? getSeverityColor(value) : getStatusColor(value);
  const label = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");

  return (
    <span
      className="inline-flex items-center gap-1.5 font-data text-[11px] tracking-[0.1em] px-2.5 py-1 rounded-full"
      style={{
        color,
        border: `1px solid ${color}33`,
        backgroundColor: `${color}0D`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label.toUpperCase()}
    </span>
  );
}
