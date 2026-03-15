import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link2, Smartphone, Globe, Monitor } from "lucide-react";

const integrations = [
  {
    name: "Apple Subscriptions",
    description: "Automatically detect App Store subscriptions.",
    icon: Smartphone,
    logo: "https://logo.clearbit.com/apple.com",
  },
  {
    name: "Google Play Subscriptions",
    description: "Detect Play Store and YouTube subscriptions.",
    icon: Globe,
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    name: "Microsoft Subscriptions",
    description: "Detect Microsoft 365, Xbox, and more.",
    icon: Monitor,
    logo: "https://logo.clearbit.com/microsoft.com",
  },
  {
    name: "Open Banking",
    description: "Detect subscriptions directly from your bank account.",
    icon: Link2,
    logo: null,
  },
];

const ConnectAccounts = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Link2 className="h-5 w-5 text-primary" />
            Future Automatic Detection
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Connect your accounts to automatically detect subscriptions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-accent/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={() => setModalOpen(true)}
                  >
                    Coming Soon
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Coming Soon</DialogTitle>
            <DialogDescription>
              This feature will use secure integrations to detect subscriptions automatically in the future.
              SubSense will notify you when it becomes available.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setModalOpen(false)} className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectAccounts;
