import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreCircle } from "./ScoreCircle";
import { ScoreBar } from "./ScoreBar";
import { EvaluationResult } from "@/lib/api";
import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

interface EvaluationResultsProps {
  results: EvaluationResult;
  candidateName: string;
}

export function EvaluationResults({ results, candidateName }: EvaluationResultsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Evaluation Results for {candidateName}
        </h2>
        <p className="text-muted-foreground">AI-powered analysis complete</p>
      </div>

      {/* Score Overview */}
      <Card variant="accent">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ScoreCircle score={results.overall_score} size="lg" label="Overall Score" />
            <div className="flex gap-8">
              <ScoreCircle score={results.authenticity_score} size="md" label="Authenticity" />
              <ScoreCircle score={results.skill_match_score} size="md" label="Skill Match" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Detailed Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreBar score={results.authenticity_score} label="Profile Authenticity" />
          <ScoreBar score={results.skill_match_score} label="Skills Match" />
          <ScoreBar score={results.overall_score} label="Overall Fit" />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{results.summary}</p>
        </CardContent>
      </Card>

      {/* Strengths & Red Flags */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.strengths.length > 0 ? (
                results.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="bg-success/10 text-success border-success/20">
                    {strength}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No strengths identified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Red Flags */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.red_flags.length > 0 ? (
                results.red_flags.map((flag, index) => (
                  <Badge key={index} variant="secondary" className="bg-danger/10 text-danger border-danger/20">
                    {flag}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No red flags detected</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
