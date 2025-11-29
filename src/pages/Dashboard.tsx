import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/CandidateCard";
import { getCandidates, getJobs } from "@/lib/api";
import { Users, Briefcase, TrendingUp, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: candidates = [] } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered recruitment analytics overview
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/jobs">
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Link>
            </Button>
            <Button asChild variant="accent">
              <Link to="/candidates">
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Candidates"
            value={candidates.length}
            icon={Users}
            trend={{ value: 12, label: "this month" }}
          />
          <StatCard
            title="Open Positions"
            value={jobs.length}
            icon={Briefcase}
            trend={{ value: 3, label: "this week" }}
          />
          <StatCard
            title="Evaluations"
            value={candidates.length > 0 ? Math.floor(candidates.length * 0.7) : 0}
            icon={Sparkles}
            trend={{ value: 24, label: "this month" }}
          />
          <StatCard
            title="Avg. Match Score"
            value="78%"
            icon={TrendingUp}
            trend={{ value: 5, label: "vs last month" }}
          />
        </div>

        {/* Recent Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Candidates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Candidates</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/candidates">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {candidates.length > 0 ? (
                <div className="space-y-4">
                  {candidates.slice(0, 3).map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No candidates yet</p>
                  <Button asChild variant="accent" className="mt-4">
                    <Link to="/candidates">Add your first candidate</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button asChild variant="outline" className="h-auto p-4 justify-start">
                  <Link to="/candidates" className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Add New Candidate</p>
                      <p className="text-sm text-muted-foreground">
                        Upload resume and profile details
                      </p>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 justify-start">
                  <Link to="/jobs" className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Briefcase className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Create Job Description</p>
                      <p className="text-sm text-muted-foreground">
                        Define requirements and responsibilities
                      </p>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 justify-start">
                  <Link to="/compare" className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Sparkles className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Compare Candidates</p>
                      <p className="text-sm text-muted-foreground">
                        AI-powered side-by-side analysis
                      </p>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
