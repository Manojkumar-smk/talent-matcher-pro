import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  Sparkles
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

function GitHubResults({ data }: { data: GitHubAnalysis }) {
  const profile = data?.profile;
  const repos = data?.repos ?? [];

  // Extract unique languages from repos for skills display
  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">GitHub Analysis</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Github className="h-4 w-4" />
              Profile: @{profile?.login ?? "Unknown"}
            </p>
            {profile?.name && (
              <p className="text-lg text-foreground mt-1">{profile.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              Profile Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium text-foreground">@{profile?.login ?? "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium text-foreground">{profile?.name ?? "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-accent" />
              Public Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-5xl font-bold text-accent">{profile?.public_repos ?? 0}</span>
              <p className="text-muted-foreground mt-2">Total Repos</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-5xl font-bold text-accent">{profile?.followers ?? 0}</span>
              <p className="text-muted-foreground mt-2">Followers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Languages/Skills */}
      {languages.length > 0 && (
        <Card variant="accent" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-accent" />
              Technologies Used
            </CardTitle>
            <CardDescription>Languages detected across repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Badge key={lang} variant="secondary" className="text-base px-4 py-2">
                  {lang}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Repositories */}
      {repos.length > 0 && (
        <Card variant="elevated" className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-accent" />
              Repositories ({repos.length})
            </CardTitle>
            <CardDescription>Public repositories analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {repos.map((repo, index) => (
                <div 
                  key={repo.name || index} 
                  className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{repo.name}</h4>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {repo.language && (
                        <Badge variant="secondary">{repo.language}</Badge>
                      )}
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">{repo.stargazers_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {repos.length === 0 && (
        <Card variant="default" className="animate-fade-in">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No repositories found for this profile</p>
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
  const [activeTab, setActiveTab] = useState("candidate");
  const [githubUrl, setGithubUrl] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
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
