import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/api";
import { Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onSelect?: () => void;
  selected?: boolean;
  className?: string;
}

export function JobCard({ job, onSelect, selected, className }: JobCardProps) {
  return (
    <Card 
      variant="interactive" 
      className={cn(
        "animate-slide-up",
        selected && "ring-2 ring-accent border-accent",
        className
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Briefcase className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{job.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {job.description.slice(0, 150)}...
        </p>
        {onSelect && (
          <Button 
            variant={selected ? "accent" : "outline"}
            size="sm" 
            className="w-full gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {selected ? "Selected" : "Select Job"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
