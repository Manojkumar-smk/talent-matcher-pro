import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CandidateCard } from "@/components/CandidateCard";
import { ScoreCircle } from "@/components/ScoreCircle";
import { getCandidates, compareCandidates, Candidate } from "@/lib/api";
import { GitCompare, Loader2, Users, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface ComparisonResult {
  candidate_id: string;
  name: string;
  overall_score: number;
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[] | null>(null);
  const [topN, setTopN] = useState<string>("10");
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  // Restore selected candidates from URL on mount
  useEffect(() => {
    const selectedIds = searchParams.get("selected");
    if (selectedIds && candidates.length > 0) {
      const ids = selectedIds.split(",");
      const restored = candidates.filter((c) => ids.includes(String(c.id)));
      if (restored.length > 0) {
        setSelectedCandidates(restored);
        setShowOnlySelected(true); // Auto-filter to show only selected
      }
    }
  }, [candidates, searchParams]);

  // Filter candidates based on selection
  const displayedCandidates = showOnlySelected 
    ? candidates.filter(c => selectedCandidates.some(sc => sc.id === c.id))
    : candidates;

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
      let newSelection: Candidate[];
      
      if (isSelected) {
        newSelection = prev.filter((c) => c.id !== candidate.id);
      } else {
        if (prev.length >= 5) {
          toast({ title: "Limit reached", description: "You can compare up to 5 candidates" });
          return prev;
        }
        newSelection = [...prev, candidate];
      }
      
      // Update URL with selected candidate IDs
      const newParams = new URLSearchParams(searchParams);
      if (newSelection.length > 0) {
        newParams.set("selected", newSelection.map((c) => c.id).join(","));
      } else {
        newParams.delete("selected");
      }
      if (jobId) newParams.set("jobId", jobId);
      setSearchParams(newParams, { replace: true });
      
      return newSelection;
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
    
    // Clear selected candidates from URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("selected");
    if (jobId) newParams.set("jobId", jobId);
    setSearchParams(newParams, { replace: true });
  };

  const selectTopNCandidates = () => {
    const n = parseInt(topN);
    
    if (isNaN(n) || n < 2) {
      toast({ 
        title: "Invalid number", 
        description: "Please enter a number of at least 2",
        variant: "destructive" 
      });
      return;
    }
    
    if (n > candidates.length) {
      toast({ 
        title: "Not enough candidates", 
        description: `Only ${candidates.length} candidates available`,
        variant: "destructive" 
      });
      return;
    }

    if (n > 10) {
      toast({ 
        title: "Too many candidates", 
        description: "You can select up to 10 candidates at a time",
        variant: "destructive" 
      });
      return;
    }
    
    const topCandidates = candidates.slice(0, n);
    setSelectedCandidates(topCandidates);
    setComparisonResults(null);
    
    // Update URL with selected candidate IDs
    const newParams = new URLSearchParams(searchParams);
    newParams.set("selected", topCandidates.map((c) => c.id).join(","));
    if (jobId) newParams.set("jobId", jobId);
    setSearchParams(newParams, { replace: true });
    
    toast({ 
      title: "Candidates selected", 
      description: `Top ${n} candidates selected` 
    });
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

        {/* Quick Selection Tool */}
        <Card variant="flat">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="flex-1 w-full sm:w-auto">
                <Label htmlFor="topN" className="text-sm font-medium">
                  Quick Select Top Candidates
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="topN"
                    type="number"
                    min="2"
                    max="10"
                    value={topN}
                    onChange={(e) => setTopN(e.target.value)}
                    placeholder="Enter number (2-10)"
                    className="w-32"
                  />
                  <Button 
                    onClick={selectTopNCandidates}
                    disabled={candidates.length === 0}
                    variant="secondary"
                  >
                    <List className="h-4 w-4 mr-2" />
                    Select Top {topN || "N"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically select the first N candidates from the list below
              </p>
            </div>
          </CardContent>
        </Card>

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
            <h2 className="text-xl font-semibold text-foreground">Results - Click to View Evaluation</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {comparisonResults
                .sort((a, b) => b.overall_score - a.overall_score)
                .map((result, index) => (
                  <Card 
                    key={result.candidate_id} 
                    variant="interactive" 
                    className="animate-slide-up cursor-pointer" 
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => window.location.href = `/candidate-evaluation?candidateId=${result.candidate_id}&jobId=${jobId}`}
                  >
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Select Candidates to Compare</h2>
              {selectedCandidates.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOnlySelected(!showOnlySelected)}
                >
                  {showOnlySelected ? "Show All Candidates" : "Show Only Selected"}
                </Button>
              )}
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : displayedCandidates.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedCandidates.map((candidate, index) => (
                  <div key={candidate.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <CandidateCard
                      candidate={candidate}
                      selected={!!selectedCandidates.find((c) => c.id === candidate.id)}
                      onSelect={() => toggleCandidate(candidate)}
                    />
                  </div>
                ))}
              </div>
            ) : showOnlySelected ? (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No candidates selected</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowOnlySelected(false)}
                  >
                    Show All Candidates
                  </Button>
                </CardContent>
              </Card>
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
