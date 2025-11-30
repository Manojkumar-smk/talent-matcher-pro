import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, Database } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [supabaseUrlOpen, setSupabaseUrlOpen] = useState(false);
  const [supabaseKeyOpen, setSupabaseKeyOpen] = useState(false);
  const [githubTokenOpen, setGithubTokenOpen] = useState(false);
  const [openaiKeyOpen, setOpenaiKeyOpen] = useState(false);
  
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");

  const handleSupabaseUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ supabaseUrl });
    toast({
      title: "Supabase URL Saved",
      description: "Your Supabase URL has been updated.",
    });
    setSupabaseUrlOpen(false);
  };

  const handleSupabaseKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ supabaseKey });
    toast({
      title: "Supabase Key Saved",
      description: "Your Supabase Key has been updated.",
    });
    setSupabaseKeyOpen(false);
  };

  const handleGithubTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ githubToken });
    toast({
      title: "GitHub Token Saved",
      description: "Your GitHub Token has been updated.",
    });
    setGithubTokenOpen(false);
  };

  const handleOpenaiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ openaiKey });
    toast({
      title: "OpenAI API Key Saved",
      description: "Your OpenAI API Key has been updated.",
    });
    setOpenaiKeyOpen(false);
  };
  return (
    <MainLayout>
      <div className="space-y-8 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your TalentAI dashboard
          </p>
        </div>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-accent" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage authentication keys for external services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* OpenAI API Key Dialog */}
            <Dialog open={openaiKeyOpen} onOpenChange={setOpenaiKeyOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  Configure OpenAI API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>OpenAI API Key</DialogTitle>
                  <DialogDescription>
                    Enter your OpenAI API key for enhanced AI analysis features.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleOpenaiKeySubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">OpenAI API Key (Optional)</Label>
                    <Input
                      id="openai-key"
                      type="password"
                      placeholder="sk-..."
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpenaiKeyOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="accent">
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              Integration Settings
            </CardTitle>
            <CardDescription>
              Configure external service integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Supabase URL Dialog */}
            <Dialog open={supabaseUrlOpen} onOpenChange={setSupabaseUrlOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  Configure Supabase URL
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Supabase URL</DialogTitle>
                  <DialogDescription>
                    Enter your Supabase project URL.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSupabaseUrlSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="supabase-url">Supabase URL</Label>
                    <Input
                      id="supabase-url"
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setSupabaseUrlOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="accent">
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Supabase Key Dialog */}
            <Dialog open={supabaseKeyOpen} onOpenChange={setSupabaseKeyOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  Configure Supabase Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Supabase Key</DialogTitle>
                  <DialogDescription>
                    Enter your Supabase anon/public key.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSupabaseKeySubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="supabase-key">Supabase Key</Label>
                    <Input
                      id="supabase-key"
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setSupabaseKeyOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="accent">
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* GitHub Token Dialog */}
            <Dialog open={githubTokenOpen} onOpenChange={setGithubTokenOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  Configure GitHub Token
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>GitHub Token</DialogTitle>
                  <DialogDescription>
                    Enter your GitHub personal access token.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGithubTokenSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-token">GitHub Token</Label>
                    <Input
                      id="github-token"
                      type="password"
                      placeholder="ghp_..."
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setGithubTokenOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="accent">
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
