import { Button } from "@/components/ui/button";
import { useRazorpay } from "@/hooks/useRazorpay";
import { CreditCard } from "lucide-react";

interface RazorpayButtonProps {
  amount: number;
  currency?: string;
  buttonText?: string;
  description?: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  disabled?: boolean;
  className?: string;
}

export function RazorpayButton({
  amount,
  currency = "INR",
  buttonText = "Pay Now",
  description,
  onSuccess,
  onFailure,
  disabled = false,
  className,
}: RazorpayButtonProps) {
  const { initiatePayment, isProcessing } = useRazorpay();

  const handlePayment = () => {
    initiatePayment({
      amount,
      currency,
      description,
      onSuccess,
      onFailure,
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      className={className}
    >
      <CreditCard className="h-4 w-4 mr-2" />
      {isProcessing ? "Processing..." : buttonText}
    </Button>
  );
}
