import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown, CheckCircle, Users, BarChart3, Shield, Zap } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: "Smart Candidate Evaluation",
      description: "AI-powered assessment of candidates against job requirements"
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      description: "Comprehensive skill matching and authenticity scoring"
    },
    {
      icon: Shield,
      title: "GitHub Analysis",
      description: "Verify candidate portfolios with deep code analysis"
    },
    {
      icon: Zap,
      title: "Quick Comparison",
      description: "Compare multiple candidates side-by-side instantly"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">TalentFitPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            AI-Powered Talent Assessment
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Fit Right.{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              Grow Fast.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Transform your hiring process with intelligent candidate evaluation. 
            Assess skills, verify authenticity, and make data-driven decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-emerald-500/30 hover:bg-emerald-500/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Hire Better
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools to streamline your recruitment process and find the perfect candidates
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose TalentFitPro?
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              "AI-powered candidate scoring and ranking",
              "GitHub portfolio deep analysis and verification",
              "Authenticity detection to identify genuine talent",
              "Side-by-side candidate comparison",
              "Detailed skill match assessment"
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-card border border-border rounded-lg p-4"
              >
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of recruiters making smarter hiring decisions with TalentFitPro
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-6 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">TalentFitPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 TalentFitPro. All rights reserved.
          </p>
          <a 
            href="mailto:support@talentfitpro.in" 
            className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors"
          >
            support@talentfitpro.in
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
