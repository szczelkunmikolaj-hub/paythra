import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link2, Smartphone, Globe, Monitor, Building2 } from "lucide-react";

const integrations = [
  { name: "Apple", description: "Detect App Store & iCloud subscriptions.", icon: Smartphone, },
  { name: "Google", description: "Detect Play Store & YouTube subscriptions.", icon: Globe, },
  { name: "Microsoft", description: "Detect Microsoft 365, Xbox & more.", icon: Monitor, },
  { name: "Open Banking", description: "Detect subscriptions from your bank.", icon: Building2, },
];

const ConnectAccounts = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Link2 className="h-5 w-5 text-primary" />
            Connect Your Accounts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Automatically detect subscriptions from your connected accounts.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {integrations.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setModalOpen(true)}
                className="group flex items-center gap-4 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/30 hover:shadow-card hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Connect {item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                  Soon
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Coming Soon</DialogTitle>
            <DialogDescription>
              Future versions of Paythra will automatically detect subscriptions from connected accounts using secure integrations.
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
