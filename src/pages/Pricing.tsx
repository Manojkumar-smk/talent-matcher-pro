import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RazorpayButton } from "@/components/RazorpayButton";
import { CheckCircle, Sparkles, Zap, Crown, Percent, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Pricing() {
  const promotionalPlan = {
    name: "Professional",
    description: "For growing teams",
    originalPrice: 1999,
    promoPrice: 49,
    promoDuration: 3,
    price: 49, // For initial payment
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
    hasPromo: true,
  };

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
      hasPromo: false,
    },
    promotionalPlan,
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
      hasPromo: false,
    },
  ];

  const calculateSavings = () => {
    const regularCost = promotionalPlan.originalPrice * promotionalPlan.promoDuration;
    const promoCost = promotionalPlan.promoPrice * promotionalPlan.promoDuration;
    return regularCost - promoCost;
  };

  const discountPercentage = Math.round(
    ((promotionalPlan.originalPrice - promotionalPlan.promoPrice) / promotionalPlan.originalPrice) * 100
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the perfect plan for your hiring needs. All plans include our AI-powered candidate evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isPromo = plan.hasPromo && 'promoPrice' in plan;
            const displayPrice = isPromo ? plan.promoPrice : plan.price;
            
            return (
              <Card 
                key={plan.name} 
                variant={plan.popular ? "accent" : "default"}
                className={`${plan.popular ? "border-2 border-accent relative overflow-hidden" : ""} transition-transform hover:scale-105`}
              >
                {isPromo && (
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground px-4 py-2 rounded-bl-lg animate-pulse">
                    <div className="flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      <span className="font-bold text-sm">{discountPercentage}% OFF</span>
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  {plan.popular && (
                    <Badge variant="default" className="w-fit mb-2">
                      Most Popular
                    </Badge>
                  )}
                  
                  {isPromo && (
                    <Alert className="mb-4 border-accent/50 bg-accent/10 animate-fade-in">
                      <Clock className="h-4 w-4 text-accent" />
                      <AlertDescription className="text-sm">
                        <span className="font-semibold text-accent">Limited Time Offer!</span>
                        <br />
                        First {plan.promoDuration} months at special price
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-6 w-6 text-accent" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-4 space-y-2">
                    {isPromo && (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-muted-foreground line-through">
                            ₹{plan.originalPrice}
                          </span>
                          <Badge variant="outline" className="border-success text-success">
                            Save ₹{calculateSavings()}
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-accent">
                            ₹{displayPrice}
                          </span>
                          <span className="text-muted-foreground">
                            /month for {plan.promoDuration} months
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Then ₹{plan.originalPrice}/month
                        </p>
                      </>
                    )}
                    
                    {!isPromo && (
                      <div>
                        <span className="text-4xl font-bold text-foreground">
                          ₹{displayPrice}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {plan.name === "Pay Per Use" ? "per evaluation" : "per month"}
                        </span>
                      </div>
                    )}
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
                
                <CardFooter className="flex-col gap-3">
                  <RazorpayButton
                    amount={displayPrice}
                    currency={plan.currency}
                    buttonText={isPromo ? `Get ${discountPercentage}% OFF Now` : `Subscribe to ${plan.name}`}
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
                  
                  {isPromo && (
                    <p className="text-xs text-center text-muted-foreground">
                      * Promotional price valid for first {plan.promoDuration} months. Standard pricing of ₹{plan.originalPrice}/month applies thereafter. Cancel anytime.
                    </p>
                  )}
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
