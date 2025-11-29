import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  label: string;
  className?: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-danger";
}

export function ScoreBar({ score, label, className }: ScoreBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold text-foreground">{Math.round(score)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getScoreColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
