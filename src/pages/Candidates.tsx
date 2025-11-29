import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CandidateCard } from "@/components/CandidateCard";
import { JobCard } from "@/components/JobCard";
import { EvaluationResults } from "@/components/EvaluationResults";
import { getCandidates, getJobs, createCandidate, evaluateCandidate, Candidate, Job, EvaluationResult } from "@/lib/api";
import { Plus, Search, Upload, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function Candidates() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEvaluateDialogOpen, setIsEvaluateDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const createMutation = useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setIsAddDialogOpen(false);
      toast({ title: "Success", description: "Candidate added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add candidate", variant: "destructive" });
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: ({ candidateId, jobId }: { candidateId: number; jobId: string }) =>
      evaluateCandidate(candidateId, jobId),
    onSuccess: (data) => {
      setEvaluationResult(data);
      toast({ title: "Success", description: "Evaluation complete" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to evaluate candidate", variant: "destructive" });
    },
  });

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCandidate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate(formData);
  };

  const handleEvaluate = () => {
    if (selectedCandidate && selectedJob) {
      evaluateMutation.mutate({
        candidateId: selectedCandidate.id,
        jobId: selectedJob.id,
      });
    }
  };

  const openEvaluateDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSelectedJob(null);
    setEvaluationResult(null);
    setIsEvaluateDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-1">
              Manage and evaluate candidate profiles
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input id="linkedin_url" name="linkedin_url" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input id="github_url" name="github_url" placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF)</Label>
                  <Input id="resume" name="resume" type="file" accept=".pdf" className="cursor-pointer" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Add Candidate
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Candidates Grid */}
        {candidatesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredCandidates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} style={{ animationDelay: `${index * 100}ms` }}>
                <CandidateCard
                  candidate={candidate}
                  onEvaluate={() => openEvaluateDialog(candidate)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <p className="text-muted-foreground">No candidates found</p>
            </CardContent>
          </Card>
        )}

        {/* Evaluate Dialog */}
        <Dialog open={isEvaluateDialogOpen} onOpenChange={setIsEvaluateDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {evaluationResult
                  ? "Evaluation Results"
                  : `Evaluate ${selectedCandidate?.name}`}
              </DialogTitle>
            </DialogHeader>

            {!evaluationResult ? (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Select a job to evaluate the candidate against:
                </p>
                {jobs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        selected={selectedJob?.id === job.id}
                        onSelect={() => setSelectedJob(job)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="py-8">
                    <CardContent className="text-center text-muted-foreground">
                      No jobs available. Create a job first.
                    </CardContent>
                  </Card>
                )}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEvaluateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="accent"
                    onClick={handleEvaluate}
                    disabled={!selectedJob || evaluateMutation.isPending}
                  >
                    {evaluateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      "Run Evaluation"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <EvaluationResults
                results={evaluationResult}
                candidateName={selectedCandidate?.name || ""}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
