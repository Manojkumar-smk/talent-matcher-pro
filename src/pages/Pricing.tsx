import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RazorpayButton } from "@/components/RazorpayButton";
import { CheckCircle, Sparkles, Zap, Crown } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Pay Per Use",
      description: "Perfect for occasional hiring needs",
      price: 499,
      currency: "INR",
      icon: Zap,
      features: [
        "1 Candidate Evaluation",
        "Basic skill matching",
        "Authenticity score",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      description: "For growing teams",
      price: 2999,
      currency: "INR",
      icon: Sparkles,
      features: [
        "10 Candidate Evaluations",
        "GitHub deep analysis",
        "Advanced skill matching",
        "Priority support",
        "PDF reports",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: 9999,
      currency: "INR",
      icon: Crown,
      features: [
        "Unlimited Evaluations",
        "Full GitHub analysis",
        "API access",
        "Dedicated support",
        "Custom integrations",
        "White-label reports",
      ],
      popular: false,
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the perfect plan for your hiring needs. All plans include our AI-powered candidate evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name} 
                variant={plan.popular ? "accent" : "default"}
                className={plan.popular ? "border-2 border-accent" : ""}
              >
                <CardHeader>
                  {plan.popular && (
                    <Badge variant="default" className="w-fit mb-2">
                      Most Popular
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-6 w-6 text-accent" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ₹{plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {plan.name === "Pay Per Use" ? "per evaluation" : "per month"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <RazorpayButton
                    amount={plan.price}
                    currency={plan.currency}
                    buttonText={`Subscribe to ${plan.name}`}
                    description={`${plan.name} - ${plan.description}`}
                    onSuccess={(response) => {
                      console.log("Payment successful:", response);
                      // Handle successful payment - grant access, update database, etc.
                    }}
                    onFailure={(error) => {
                      console.error("Payment failed:", error);
                    }}
                    className="w-full"
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <Card variant="elevated" className="mt-12">
          <CardHeader>
            <CardTitle>Need a Custom Solution?</CardTitle>
            <CardDescription>
              Contact us for enterprise pricing and custom features tailored to your organization's needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Email us at{" "}
              <a href="mailto:support@talentmatcher.pro" className="text-accent hover:underline">
                support@talentmatcher.pro
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
