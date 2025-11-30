import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Candidate } from "@/lib/api";
import { 
  Mail, 
  Github, 
  Linkedin, 
  FileText, 
  ExternalLink, 
  User,
  Download,
  Eye
} from "lucide-react";
import { useState } from "react";

interface CandidateDetailsDialogProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEvaluate?: () => void;
}

export function CandidateDetailsDialog({ 
  candidate, 
  open, 
  onOpenChange,
  onEvaluate 
}: CandidateDetailsDialogProps) {
  const [showResume, setShowResume] = useState(false);

  if (!candidate) return null;

  const initials = (candidate.name || "")
    .split(" ")
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const hasResume = candidate.resume_text || candidate.resume_url;

  const handleViewResume = () => {
    if (candidate.resume_url) {
      window.open(candidate.resume_url, '_blank');
    } else {
      setShowResume(!showResume);
    }
  };

  const handleDownloadResume = () => {
    if (candidate.resume_url) {
      const link = document.createElement('a');
      link.href = candidate.resume_url;
      link.download = `${candidate.name.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (candidate.resume_text) {
      // Create a text file from resume_text
      const blob = new Blob([candidate.resume_text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${candidate.name.replace(/\s+/g, '_')}_resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
              {initials}
            </div>
            <div>
              <span className="text-xl">{candidate.name}</span>
              <p className="text-sm font-normal text-muted-foreground">{candidate.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Contact Info */}
            <Card variant="elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${candidate.email}`} 
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    {candidate.email}
                  </a>
                </div>
                
                {candidate.linkedin_url && (
                  <div className="flex items-center gap-2 text-sm">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={candidate.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-accent transition-colors flex items-center gap-1"
                    >
                      LinkedIn Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                
                {candidate.github_url && (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={candidate.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-accent transition-colors flex items-center gap-1"
                    >
                      GitHub Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Links/Badges */}
            <div className="flex flex-wrap gap-2">
              {candidate.github_url && (
                <Badge variant="secondary" className="gap-1.5">
                  <Github className="h-3 w-3" />
                  GitHub Connected
                </Badge>
              )}
              {candidate.linkedin_url && (
                <Badge variant="secondary" className="gap-1.5">
                  <Linkedin className="h-3 w-3" />
                  LinkedIn Connected
                </Badge>
              )}
              {hasResume && (
                <Badge variant="secondary" className="gap-1.5">
                  <FileText className="h-3 w-3" />
                  Resume Available
                </Badge>
              )}
            </div>

            {/* Resume Section */}
            {hasResume && (
              <Card variant="elevated">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      Resume
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleViewResume}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {candidate.resume_url ? "Open" : showResume ? "Hide" : "View"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownloadResume}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {/* Show resume text if viewing and no URL */}
                {showResume && candidate.resume_text && !candidate.resume_url && (
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                        {candidate.resume_text}
                      </pre>
                    </div>
                  </CardContent>
                )}

                {/* Show PDF iframe if URL is available */}
                {candidate.resume_url && (
                  <CardContent>
                    <div className="bg-muted rounded-lg overflow-hidden">
                      <iframe
                        src={candidate.resume_url}
                        className="w-full h-96 border-0"
                        title={`${candidate.name}'s Resume`}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEvaluate && (
            <Button variant="accent" onClick={onEvaluate}>
              Evaluate Candidate
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
