import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreBar } from "@/components/ScoreBar";
import { ScoreCircle } from "@/components/ScoreCircle";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { githubDeepCheck, type GitHubAnalysis } from "@/lib/api";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Code, 
  GitBranch, 
  Star, 
  Activity,
  Shield,
  TrendingUp,
  Search,
  Github
} from "lucide-react";
import { cn } from "@/lib/utils";

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "pass":
      return <CheckCircle className="h-5 w-5 text-success" />;
    case "fail":
      return <XCircle className="h-5 w-5 text-danger" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-warning" />;
  }
}

function getRiskLevel(score: number) {
  if (score <= 20) return { label: "Low Risk", color: "text-success" };
  if (score <= 50) return { label: "Medium Risk", color: "text-warning" };
  return { label: "High Risk", color: "text-danger" };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-24 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

function EvaluationResults({ data }: { data: GitHubAnalysis }) {
  const riskLevel = getRiskLevel(data.overall_risk_score);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Candidate Evaluation</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub Profile: @{data.username}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-2">Overall Risk Score</p>
            <div className="flex items-center gap-3">
              <ScoreCircle score={100 - data.overall_risk_score} size="lg" />
              <div>
                <p className={cn("text-2xl font-bold", riskLevel.color)}>{riskLevel.label}</p>
                <p className="text-sm text-muted-foreground">Score: {data.overall_risk_score}/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-accent" />
                Originality
              </CardTitle>
              {getStatusIcon(data.originality_check.status)}
            </div>
            <CardDescription>{data.originality_check.details}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreBar score={data.originality_check.score} label="Originality Score" />
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Commit Authenticity
              </CardTitle>
              {getStatusIcon(data.commit_pattern_authenticity.status)}
            </div>
            <CardDescription>{data.commit_pattern_authenticity.details}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreBar score={data.commit_pattern_authenticity.score} label="Authenticity Score" />
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" />
                Code Quality
              </CardTitle>
              <Badge variant={data.code_quality.score >= 70 ? "default" : data.code_quality.score >= 50 ? "secondary" : "destructive"}>
                Grade {data.code_quality.rating}
              </Badge>
            </div>
            <CardDescription>{data.code_quality.details}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreBar score={data.code_quality.score} label="Quality Score" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="accent" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Tech Stack Verification
            </CardTitle>
            <CardDescription>{data.tech_stack_verification.claimed_vs_actual}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar score={data.tech_stack_verification.match_score} label="Match Score" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Verified Skills</p>
              <div className="flex flex-wrap gap-2">
                {data.tech_stack_verification.verified_skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="accent" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Project Depth
            </CardTitle>
            <CardDescription>{data.project_depth.details}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar score={data.project_depth.score} label="Depth Score" />
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-lg px-4 py-2">
                {data.project_depth.level}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              AI Code Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={data.ai_generated_code_check.ai_probability < 30 ? "default" : "destructive"}>
                {data.ai_generated_code_check.status}
              </Badge>
            </div>
            <ScoreBar score={100 - data.ai_generated_code_check.ai_probability} label="Human Code Probability" />
            <p className="text-sm text-muted-foreground">{data.ai_generated_code_check.details}</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Timeline Consistency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar score={data.activity_timeline_consistency.consistency_score} label="Consistency Score" />
            <p className="text-sm text-muted-foreground">{data.activity_timeline_consistency.details}</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Repository Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreBar score={data.repo_health_score.score} label="Health Score" />
            <p className="text-sm text-muted-foreground">{data.repo_health_score.details}</p>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-accent" />
            Skill Validation
          </CardTitle>
          <CardDescription>Proficiency Level: <Badge variant="default">{data.skill_validation.proficiency}</Badge></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.skill_validation.derived_skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-base px-4 py-2">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CandidateEvaluation() {
  const [githubUrl, setGithubUrl] = useState("");
  const { toast } = useToast();

  const { mutate: analyze, data, isPending, reset } = useMutation({
    mutationFn: githubDeepCheck,
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a GitHub URL",
        variant: "destructive",
      });
      return;
    }
    analyze(githubUrl.trim());
  };

  const handleReset = () => {
    setGithubUrl("");
    reset();
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <Card variant="elevated" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-6 w-6 text-accent" />
              GitHub Profile Analysis
            </CardTitle>
            <CardDescription>
              Enter a GitHub profile URL to perform deep validation and skill verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="flex-1"
                disabled={isPending}
              />
              <Button type="submit" disabled={isPending || !githubUrl.trim()}>
                {isPending ? (
                  <>
                    <Search className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
              {data && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  New Analysis
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {isPending && <LoadingSkeleton />}

        {data && !isPending && <EvaluationResults data={data} />}

        {!data && !isPending && (
          <div className="text-center py-16 animate-fade-in">
            <Github className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Analysis Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a GitHub profile URL above to start analyzing a candidate's coding history, 
              skill verification, and project authenticity.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
