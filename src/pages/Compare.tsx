import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/CandidateCard";
import { ScoreCircle } from "@/components/ScoreCircle";
import { getCandidates, compareCandidates, Candidate } from "@/lib/api";
import { GitCompare, Loader2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface ComparisonResult {
  candidate_id: string;
  name: string;
  overall_score: number;
}

export default function Compare() {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[] | null>(null);

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  const compareMutation = useMutation({
    mutationFn: compareCandidates,
    onSuccess: (data) => {
      setComparisonResults(data);
      toast({ title: "Success", description: "Comparison complete" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to compare candidates", variant: "destructive" });
    },
  });

  const toggleCandidate = (candidate: Candidate) => {
    setSelectedCandidates((prev) => {
      const isSelected = prev.find((c) => c.id === candidate.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== candidate.id);
      }
      if (prev.length >= 5) {
        toast({ title: "Limit reached", description: "You can compare up to 5 candidates" });
        return prev;
      }
      return [...prev, candidate];
    });
    setComparisonResults(null);
  };

  const handleCompare = () => {
    if (selectedCandidates.length < 2) {
      toast({ title: "Select more candidates", description: "Please select at least 2 candidates to compare" });
      return;
    }
    compareMutation.mutate(selectedCandidates.map((c) => String(c.id)));
  };

  const clearSelection = () => {
    setSelectedCandidates([]);
    setComparisonResults(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compare Candidates</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered side-by-side candidate analysis
            </p>
          </div>
          <div className="flex gap-3">
            {selectedCandidates.length > 0 && (
              <Button variant="outline" onClick={clearSelection}>
                Clear Selection
              </Button>
            )}
            <Button
              variant="accent"
              onClick={handleCompare}
              disabled={selectedCandidates.length < 2 || compareMutation.isPending}
            >
              {compareMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare ({selectedCandidates.length})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Selection Info */}
        {selectedCandidates.length > 0 && (
          <Card variant="accent" className="animate-scale-in">
            <CardContent className="py-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-medium text-foreground">Selected:</span>
                {selectedCandidates.map((c) => (
                  <Badge key={c.id} variant="secondary" className="gap-2">
                    {c.name}
                    <button
                      onClick={() => toggleCandidate(c)}
                      className="hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Results */}
        {comparisonResults && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground">Results</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {comparisonResults
                .sort((a, b) => b.overall_score - a.overall_score)
                .map((result, index) => (
                  <Card key={result.candidate_id} variant="default" className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </span>
                        {result.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex justify-center">
                        <ScoreCircle score={result.overall_score} size="lg" label="Overall Score" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Candidates Selection Grid */}
        {!comparisonResults && (
          <>
            <h2 className="text-xl font-semibold text-foreground">Select Candidates to Compare</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : candidates.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <CandidateCard
                      candidate={candidate}
                      selected={!!selectedCandidates.find((c) => c.id === candidate.id)}
                      onSelect={() => toggleCandidate(candidate)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No candidates available for comparison</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
