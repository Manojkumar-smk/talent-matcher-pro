import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "@/components/ScoreBar";
import { ScoreCircle } from "@/components/ScoreCircle";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Code, 
  GitBranch, 
  Star, 
  Activity,
  Shield,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EvaluationData {
  username: string;
  originality_check: {
    score: number;
    status: string;
    details: string;
  };
  commit_pattern_authenticity: {
    score: number;
    status: string;
    details: string;
  };
  code_quality: {
    score: number;
    rating: string;
    details: string;
  };
  tech_stack_verification: {
    match_score: number;
    verified_skills: string[];
    claimed_vs_actual: string;
  };
  project_depth: {
    score: number;
    level: string;
    details: string;
  };
  ai_generated_code_check: {
    ai_probability: number;
    status: string;
    details: string;
  };
  activity_timeline_consistency: {
    consistency_score: number;
    details: string;
  };
  repo_health_score: {
    score: number;
    details: string;
  };
  skill_validation: {
    derived_skills: string[];
    proficiency: string;
  };
  overall_risk_score: number;
}

// Mock data - in real app, this would come from props or API
const mockData: EvaluationData = {
  username: "Manojkumar-smk",
  originality_check: {
    score: 91,
    status: "Pass",
    details: "11 original repos out of 12."
  },
  commit_pattern_authenticity: {
    score: 100,
    status: "Pass",
    details: "Activity spread across 9 days in recent history."
  },
  code_quality: {
    score: 25,
    rating: "D",
    details: "Average quality score based on metadata: 25/100"
  },
  tech_stack_verification: {
    match_score: 100,
    verified_skills: ["Jupyter Notebook", "Python", "Shell"],
    claimed_vs_actual: "Verified against top repos"
  },
  project_depth: {
    score: 100,
    level: "Advanced",
    details: "5 substantial or popular repositories."
  },
  ai_generated_code_check: {
    ai_probability: 10,
    status: "Human-written",
    details: "Heuristic check passed (placeholder)."
  },
  activity_timeline_consistency: {
    consistency_score: 100,
    details: "Account is 3037 days old."
  },
  repo_health_score: {
    score: 63,
    details: "Repo health score: 63/100 (based on license, issues, description)"
  },
  skill_validation: {
    derived_skills: ["Jupyter Notebook", "Python", "Shell"],
    proficiency: "High"
  },
  overall_risk_score: 5
};

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

export default function CandidateEvaluation() {
  const data = mockData;
  const riskLevel = getRiskLevel(data.overall_risk_score);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Candidate Evaluation</h1>
              <p className="text-muted-foreground mt-2">GitHub Profile: @{data.username}</p>
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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Originality Check */}
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

          {/* Commit Pattern */}
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

          {/* Code Quality */}
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

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tech Stack Verification */}
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

          {/* Project Depth */}
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

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Generated Code */}
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

          {/* Activity Timeline */}
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

          {/* Repo Health */}
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

        {/* Skill Validation */}
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
    </MainLayout>
  );
}
