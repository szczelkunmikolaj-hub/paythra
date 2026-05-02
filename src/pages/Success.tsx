import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const Success = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setStatus("error");
        setErrorMsg("Missing session ID.");
        return;
      }
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { session_id: sessionId },
      });
      if (error || !data?.success) {
        setStatus("error");
        setErrorMsg(data?.error || error?.message || "Could not verify payment.");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["user_plan"] });
      setStatus("success");
    };
    verify();
  }, [sessionId, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SEO title="Payment Successful — Paythra Premium" description="Welcome to Paythra Premium." canonical="https://paythra.com/success" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border bg-card shadow-elevated"
      >
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
            <h1 className="font-display text-2xl font-bold">Confirming your payment…</h1>
            <p className="text-muted-foreground">One moment while we activate your Premium access.</p>
          </>
        )}
        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center"
            >
              <CheckCircle2 className="h-9 w-9 text-white" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Welcome to Paythra Premium!
            </h1>
            <p className="text-muted-foreground">
              Your lifetime access is active. Enjoy unlimited subscriptions, AI auto-detection,
              and every premium feature — forever.
            </p>
            <Button
              className="w-full bg-gradient-primary text-white hover:opacity-90"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Go to dashboard
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h1 className="font-display text-2xl font-bold">We couldn't verify your payment</h1>
            <p className="text-muted-foreground">{errorMsg}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/pricing">Back to pricing</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Success;
