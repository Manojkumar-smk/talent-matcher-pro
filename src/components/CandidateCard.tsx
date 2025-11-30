import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/lib/api";
import { Mail, Github, Linkedin, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  onEvaluate?: () => void;
  onSelect?: () => void;
  selected?: boolean;
  className?: string;
}

export function CandidateCard({ 
  candidate, 
  onEvaluate, 
  onSelect,
  selected,
  className 
}: CandidateCardProps) {
  const initials = (candidate?.name || "")
    .split(" ")
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <Card 
      variant="interactive" 
      className={cn(
        "animate-slide-up cursor-pointer hover:shadow-lg transition-shadow",
        selected && "ring-2 ring-accent border-accent",
        className
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{candidate.email}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {candidate.github_url && (
            <Badge variant="secondary" className="gap-1.5">
              <Github className="h-3 w-3" />
              GitHub
            </Badge>
          )}
          {candidate.linkedin_url && (
            <Badge variant="secondary" className="gap-1.5">
              <Linkedin className="h-3 w-3" />
              LinkedIn
            </Badge>
          )}
          {candidate.resume_text && (
            <Badge variant="secondary" className="gap-1.5">
              <FileText className="h-3 w-3" />
              Resume
            </Badge>
          )}
        </div>
        {onEvaluate && (
          <Button 
            variant="accent" 
            size="sm" 
            className="w-full gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onEvaluate();
            }}
          >
            Evaluate
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
