import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreBar } from "@/components/ScoreBar";
import { ScoreCircle } from "@/components/ScoreCircle";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  githubDeepCheck, 
  evaluateCandidate, 
  getCandidates, 
  getJobs,
  type GitHubAnalysis, 
  type EvaluationResult,
} from "@/lib/api";
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
  Github,
  User,
  Briefcase,
  FileText,
  Sparkles,
  ArrowLeft
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

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 50) return "bg-warning";
  return "bg-danger";
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = status.toLowerCase();
  if (s === "pass" || s === "human-written") return "default";
  if (s === "fail") return "destructive";
  return "secondary";
}

function ScoreCard({ 
  title, 
  score, 
  status, 
  details, 
  icon 
}: { 
  title: string; 
  score: number; 
  status?: string; 
  details?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card variant="elevated" className="animate-slide-up">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
          {status && (
            <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <div className={cn("text-3xl font-bold", getScoreColor(score))}>
            {score}
          </div>
          <div className="flex-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all", getScoreBgColor(score))}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
        {details && (
          <p className="text-sm text-muted-foreground">{details}</p>
        )}
      </CardContent>
    </Card>
  );
}

function GitHubResults({ data }: { data: GitHubAnalysis }) {
  const username = data?.username ?? data?.profile?.login ?? "Unknown";
  const overallRisk = data?.overall_risk_score ?? 0;
  const verifiedSkills = data?.tech_stack_verification?.verified_skills ?? data?.skill_validation?.derived_skills ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Overall Risk Score */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">GitHub Deep Analysis</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Github className="h-4 w-4" />
            @{username}
          </p>
        </div>
        <Card variant="accent" className="px-6 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Overall Risk Score</p>
            <div className={cn("text-4xl font-bold", overallRisk <= 20 ? "text-success" : overallRisk <= 50 ? "text-warning" : "text-danger")}>
              {overallRisk}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallRisk <= 20 ? "Low Risk" : overallRisk <= 50 ? "Medium Risk" : "High Risk"}
            </p>
          </div>
        </Card>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.originality_check && (
          <ScoreCard
            title="Originality"
            score={data.originality_check.score}
            status={data.originality_check.status}
            details={data.originality_check.details}
            icon={<CheckCircle className="h-4 w-4 text-accent" />}
          />
        )}

        {data?.commit_pattern_authenticity && (
          <ScoreCard
            title="Commit Authenticity"
            score={data.commit_pattern_authenticity.score}
            status={data.commit_pattern_authenticity.status}
            details={data.commit_pattern_authenticity.details}
            icon={<GitBranch className="h-4 w-4 text-accent" />}
          />
        )}

        {data?.code_quality && (
          <ScoreCard
            title="Code Quality"
            score={data.code_quality.score}
            status={`Grade: ${data.code_quality.rating}`}
            details={data.code_quality.details}
            icon={<Code className="h-4 w-4 text-accent" />}
          />
        )}

        {data?.project_depth && (
          <ScoreCard
            title="Project Depth"
            score={data.project_depth.score}
            status={data.project_depth.level}
            details={data.project_depth.details}
            icon={<TrendingUp className="h-4 w-4 text-accent" />}
          />
        )}

        {data?.activity_timeline_consistency && (
          <ScoreCard
            title="Activity Consistency"
            score={data.activity_timeline_consistency.consistency_score}
            details={data.activity_timeline_consistency.details}
            icon={<Activity className="h-4 w-4 text-accent" />}
          />
        )}

        {data?.repo_health_score && (
          <ScoreCard
            title="Repository Health"
            score={data.repo_health_score.score}
            details={data.repo_health_score.details}
            icon={<Star className="h-4 w-4 text-accent" />}
          />
        )}
      </div>

      {/* AI Detection Card */}
      {data?.ai_generated_code_check && (
        <Card variant={data.ai_generated_code_check.ai_probability > 50 ? "default" : "elevated"} className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                AI-Generated Code Detection
              </span>
              <Badge variant={data.ai_generated_code_check.status === "Human-written" ? "default" : "destructive"}>
                {data.ai_generated_code_check.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">AI Probability</span>
                  <span className={cn("font-medium", data.ai_generated_code_check.ai_probability > 50 ? "text-danger" : "text-success")}>
                    {data.ai_generated_code_check.ai_probability}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", data.ai_generated_code_check.ai_probability > 50 ? "bg-danger" : "bg-success")}
                    style={{ width: `${data.ai_generated_code_check.ai_probability}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{data.ai_generated_code_check.details}</p>
          </CardContent>
        </Card>
      )}

      {/* Tech Stack Verification */}
      {data?.tech_stack_verification && (
        <Card variant="accent" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" />
                Tech Stack Verification
              </span>
              <Badge variant="secondary">Match: {data.tech_stack_verification.match_score}%</Badge>
            </CardTitle>
            <CardDescription>{data.tech_stack_verification.claimed_vs_actual}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {verifiedSkills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Validation */}
      {data?.skill_validation && !data?.tech_stack_verification && (
        <Card variant="accent" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" />
                Skill Validation
              </span>
              <Badge variant="secondary">Proficiency: {data.skill_validation.proficiency}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.skill_validation.derived_skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legacy Profile/Repos display for backward compatibility */}
      {data?.profile && (
        <Card variant="elevated" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-accent">{data.profile.public_repos}</p>
                <p className="text-sm text-muted-foreground">Repositories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{data.profile.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              {data.profile.name && (
                <div className="col-span-2">
                  <p className="text-lg font-medium text-foreground">{data.profile.name}</p>
                  <p className="text-sm text-muted-foreground">@{data.profile.login}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {data?.repos && data.repos.length > 0 && (
        <Card variant="elevated" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-accent" />
              Top Repositories ({data.repos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {data.repos.slice(0, 5).map((repo, index) => (
                <div 
                  key={repo.name || index} 
                  className="p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{repo.name}</h4>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground truncate">{repo.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {repo.language && <Badge variant="outline">{repo.language}</Badge>}
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium">{repo.stargazers_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CandidateEvaluationResults({ data, candidateName }: { data: EvaluationResult; candidateName: string }) {
  // Safe accessors with defaults
  const overallScore = data?.overall_score ?? 0;
  const authenticityScore = data?.authenticity_score ?? 0;
  const skillMatchScore = data?.skill_match_score ?? 0;
  const summary = data?.summary ?? "No summary available";
  const strengths = data?.strengths ?? [];
  const redFlags = data?.red_flags ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Evaluation Results for {candidateName}
        </h2>
        <p className="text-muted-foreground">AI-powered comprehensive analysis</p>
      </div>

      {/* Score Overview */}
      <Card variant="accent">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ScoreCircle score={overallScore} size="lg" label="Overall Score" />
            <div className="flex gap-8">
              <ScoreCircle score={authenticityScore} size="md" label="Authenticity" />
              <ScoreCircle score={skillMatchScore} size="md" label="Skill Match" />
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
          <ScoreBar score={authenticityScore} label="Profile Authenticity" />
          <ScoreBar score={skillMatchScore} label="Skills Match" />
          <ScoreBar score={overallScore} label="Overall Fit" />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{summary}</p>
        </CardContent>
      </Card>

      {/* Strengths & Red Flags */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {strengths.length > 0 ? (
                strengths.map((strength, index) => (
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

        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {redFlags.length > 0 ? (
                redFlags.map((flag, index) => (
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

      {/* GitHub Analysis if available */}
      {data?.github_analysis && (
        <div className="pt-8 border-t border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">GitHub Deep Analysis</h3>
          <GitHubResults data={data.github_analysis} />
        </div>
      )}
    </div>
  );
}

export default function CandidateEvaluation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlCandidateId = searchParams.get("candidateId");
  const urlJobId = searchParams.get("jobId");
  
  const [activeTab, setActiveTab] = useState("candidate");
  const [githubUrl, setGithubUrl] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>(urlCandidateId || "");
  const [selectedJob, setSelectedJob] = useState<string>(urlJobId || "");
  const { toast } = useToast();

  // Fetch candidates and jobs
  const { data: candidates = [] } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  // GitHub Deep Check mutation
  const { 
    mutate: analyzeGithub, 
    data: githubData, 
    isPending: isGithubPending, 
    reset: resetGithub 
  } = useMutation({
    mutationFn: (url: string) => {
      console.log("Calling GitHub Deep Check API with URL:", url);
      return githubDeepCheck(url);
    },
    onSuccess: (result) => {
      console.log("GitHub API Response:", result);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed @${result.profile?.login ?? 'unknown'}`,
      });
    },
    onError: (error: Error) => {
      console.error("GitHub API Error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Candidate Evaluation mutation
  const { 
    mutate: evaluateCandidateMutation, 
    data: evaluationData, 
    isPending: isEvaluationPending, 
    reset: resetEvaluation 
  } = useMutation({
    mutationFn: ({ candidateId, jobId }: { candidateId: number; jobId: string }) => {
      console.log("Calling Evaluate API with candidateId:", candidateId, "jobId:", jobId);
      return evaluateCandidate(candidateId, jobId);
    },
    onSuccess: (result) => {
      console.log("Evaluation API Response:", result);
      toast({
        title: "Evaluation Complete",
        description: "Candidate has been evaluated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Evaluation API Error:", error);
      toast({
        title: "Evaluation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a GitHub URL",
        variant: "destructive",
      });
      return;
    }
    analyzeGithub(githubUrl.trim());
  };

  const handleCandidateEvaluate = () => {
    if (!selectedCandidate || !selectedJob) {
      toast({
        title: "Missing Selection",
        description: "Please select both a candidate and a job",
        variant: "destructive",
      });
      return;
    }
    evaluateCandidateMutation({ 
      candidateId: parseInt(selectedCandidate), 
      jobId: selectedJob 
    });
  };

  const handleGithubReset = () => {
    setGithubUrl("");
    resetGithub();
  };

  const handleEvaluationReset = () => {
    setSelectedCandidate("");
    setSelectedJob("");
    resetEvaluation();
  };

  const selectedCandidateData = candidates.find(c => c.id.toString() === selectedCandidate);

  // Auto-populate GitHub URL when candidate is selected
  useEffect(() => {
    if (selectedCandidateData?.github_url) {
      setGithubUrl(selectedCandidateData.github_url);
    }
  }, [selectedCandidate, selectedCandidateData]);

  // Auto-evaluate and GitHub deep check when URL params are present
  useEffect(() => {
    if (urlCandidateId && urlJobId && candidates.length > 0 && jobs.length > 0 && !evaluationData) {
      // Trigger candidate evaluation
      evaluateCandidateMutation({ 
        candidateId: parseInt(urlCandidateId), 
        jobId: urlJobId 
      });

      // Also trigger GitHub deep check if candidate has GitHub URL
      const candidate = candidates.find(c => c.id.toString() === urlCandidateId);
      if (candidate?.github_url && !githubData) {
        setGithubUrl(candidate.github_url);
        analyzeGithub(candidate.github_url);
      }
    }
  }, [urlCandidateId, urlJobId, candidates, jobs]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button - Show when coming from Compare page */}
        {urlJobId && (
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Comparison
          </Button>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="candidate" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Candidate Evaluation
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub Deep Check
            </TabsTrigger>
          </TabsList>

          {/* Candidate Evaluation Tab */}
          <TabsContent value="candidate" className="space-y-8">
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-accent" />
                  Evaluate Candidate Against Job
                </CardTitle>
                <CardDescription>
                  Select a candidate and job to perform comprehensive evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((candidate) => (
                        <SelectItem key={candidate.id} value={candidate.id.toString()}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {candidate.name} - {candidate.email}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {job.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    onClick={handleCandidateEvaluate} 
                    disabled={isEvaluationPending || !selectedCandidate || !selectedJob}
                  >
                    {isEvaluationPending ? (
                      <>
                        <Search className="h-4 w-4 mr-2 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Evaluate
                      </>
                    )}
                  </Button>
                  {evaluationData && (
                    <Button type="button" variant="outline" onClick={handleEvaluationReset}>
                      New Evaluation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {isEvaluationPending && <LoadingSkeleton />}

            {evaluationData && !isEvaluationPending && (
              <CandidateEvaluationResults 
                data={evaluationData} 
                candidateName={selectedCandidateData?.name || "Candidate"} 
              />
            )}

            {!evaluationData && !isEvaluationPending && (
              <div className="text-center py-16 animate-fade-in">
                <User className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Evaluation Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select a candidate and a job position above to perform a comprehensive 
                  evaluation including skill matching, authenticity scoring, and detailed analysis.
                </p>
              </div>
            )}
          </TabsContent>

          {/* GitHub Deep Check Tab */}
          <TabsContent value="github" className="space-y-8">
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
                <form onSubmit={handleGithubSubmit} className="flex gap-4">
                  <Input
                    type="url"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="flex-1"
                    disabled={isGithubPending}
                  />
                  <Button type="submit" disabled={isGithubPending || !githubUrl.trim()}>
                    {isGithubPending ? (
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
                  {githubData && (
                    <Button type="button" variant="outline" onClick={handleGithubReset}>
                      New Analysis
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {isGithubPending && <LoadingSkeleton />}

            {githubData && !isGithubPending && <GitHubResults data={githubData} />}

            {!githubData && !isGithubPending && (
              <div className="text-center py-16 animate-fade-in">
                <Github className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Analysis Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter a GitHub profile URL above to start analyzing a candidate's coding history, 
                  skill verification, and project authenticity.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
