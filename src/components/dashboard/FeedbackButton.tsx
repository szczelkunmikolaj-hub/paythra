import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const FeedbackButton = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await supabase.from("notifications").insert({
        user_id: user?.id,
        type: "feedback",
        message: `[FEEDBACK] ${user?.email}: ${text.trim()}`,
      });
      setSent(true);
      setText("");
      setTimeout(() => {
        setSent(false);
        setOpen(false);
      }, 2000);
    } catch {
      toast({ title: t("feedbackError"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground"
        aria-label={t("feedbackTitle")}
        title={t("feedbackTitle")}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t("feedbackTitle")}
            </DialogTitle>
          </DialogHeader>
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <p className="font-medium text-foreground">{t("feedbackThanks")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("feedbackPlaceholder")}
                rows={5}
                maxLength={1000}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{text.length}/1000</span>
                <Button
                  onClick={handleSend}
                  disabled={sending || !text.trim()}
                  className="gap-2 bg-gradient-primary hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                  {sending ? t("feedbackSending") : t("feedbackSend")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackButton;
