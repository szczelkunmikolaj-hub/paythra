import { useState } from "react";
import { CheckCircle2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaythraEmailRequest, toSuggestedEmail } from "@/hooks/usePaythraEmailRequest";

const PaythraEmailBeta = () => {
  const { request, isLoading, submit, isSubmitting } = usePaythraEmailRequest();
  const [name, setName] = useState("");

  const preview = toSuggestedEmail(name);
  const isAlreadyDone = !!request;

  if (isLoading) return null;

  return (
    // Gradient border wrapper
    <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-r from-amber-400 via-purple-500 to-primary shadow-glow">
      <div className="relative rounded-[calc(1rem-1.5px)] bg-card px-6 py-5">

        {/* BETA badge */}
        <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          Beta
        </span>

        {isAlreadyDone || request ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">You're on the list!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll set up{" "}
                <span className="font-mono font-semibold text-primary">
                  {request.suggested_email}
                </span>{" "}
                and email you within 24 hours.
              </p>
            </div>
          </div>
        ) : (
          /* ── Request form ── */
          <>
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-card">
                <Mail className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground leading-tight">
                  Get your personal PAYTHRA email
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  One address for all your subscriptions — auto-detection, zero inbox clutter.{" "}
                  <span className="font-medium text-foreground/70">Beta · limited spots.</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="paythra-email-name" className="text-xs font-medium">
                  Your name
                </Label>
                <Input
                  id="paythra-email-name"
                  placeholder="e.g. Nico Gomez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              {/* Live email preview */}
              <div className="min-h-[1.5rem]">
                {preview ? (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Your email will be:{" "}
                    <span className="font-mono font-semibold text-primary">{preview}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground/50">
                    Type your name to see your email preview
                  </p>
                )}
              </div>

              <Button
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                size="sm"
                onClick={() => submit(name)}
                disabled={isSubmitting || !preview}
              >
                <Mail className="mr-2 h-3.5 w-3.5" />
                {isSubmitting ? "Requesting…" : "Request my PAYTHRA email"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaythraEmailBeta;
