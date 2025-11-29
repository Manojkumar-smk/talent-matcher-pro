import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, Key } from "lucide-react";

export default function Settings() {
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

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-accent" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure the connection to your backend API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">API Base URL</Label>
              <Input
                id="api-url"
                defaultValue="http://127.0.0.1:5000"
                placeholder="http://localhost:5000"
              />
              <p className="text-xs text-muted-foreground">
                The base URL for your Flask backend API
              </p>
            </div>
            <Button variant="accent">Save Changes</Button>
          </CardContent>
        </Card>

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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key (Optional)</Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground">
                Used for enhanced AI analysis features
              </p>
            </div>
            <Button variant="accent">Update Keys</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
