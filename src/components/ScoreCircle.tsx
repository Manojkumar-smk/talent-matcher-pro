import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
}

function getScoreStroke(score: number) {
  if (score >= 80) return "stroke-success";
  if (score >= 60) return "stroke-warning";
  return "stroke-danger";
}

export function ScoreCircle({ score, size = "md", label, className }: ScoreCircleProps) {
  const sizeConfig = {
    sm: { container: "h-16 w-16", text: "text-lg", label: "text-xs", stroke: 4 },
    md: { container: "h-24 w-24", text: "text-2xl", label: "text-sm", stroke: 5 },
    lg: { container: "h-32 w-32", text: "text-3xl", label: "text-sm", stroke: 6 },
  };

  const config = sizeConfig[size];
  const radius = size === "sm" ? 28 : size === "md" ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className={cn("relative", config.container)}>
        <svg className="w-full h-full -rotate-90" viewBox={size === "sm" ? "0 0 64 64" : size === "md" ? "0 0 96 96" : "0 0 128 128"}>
          {/* Background circle */}
          <circle
            cx={size === "sm" ? "32" : size === "md" ? "48" : "64"}
            cy={size === "sm" ? "32" : size === "md" ? "48" : "64"}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={size === "sm" ? "32" : size === "md" ? "48" : "64"}
            cy={size === "sm" ? "32" : size === "md" ? "48" : "64"}
            r={radius}
            fill="none"
            className={cn("transition-all duration-1000 ease-out", getScoreStroke(score))}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", config.text, getScoreColor(score))}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      {label && (
        <span className={cn("text-muted-foreground font-medium", config.label)}>{label}</span>
      )}
    </div>
  );
}
