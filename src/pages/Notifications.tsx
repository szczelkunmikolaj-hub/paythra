import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck, AlertTriangle, Clock, CreditCard, TrendingUp, TrendingDown, Eye, PlusCircle } from "lucide-react";

const typeConfig: Record<string, { icon: typeof Bell; label: string; color: string }> = {
  upcoming_charge: { icon: CreditCard, label: "Upcoming Charge", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  trial_ending: { icon: Clock, label: "Trial Ending Soon", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
  unused_subscription: { icon: Eye, label: "Unused Subscription", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  price_increase: { icon: TrendingUp, label: "Price Increase", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  price_decrease: { icon: TrendingDown, label: "Price Decrease", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  subscription_detected: { icon: AlertTriangle, label: "Subscription Detected", color: "bg-primary/10 text-primary" },
  subscription_added: { icon: PlusCircle, label: "Subscription Added", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const Notifications = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllAsRead()} className="text-primary">
              <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <Bell className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground">Alerts about trials, charges, and unused subscriptions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const config = typeConfig[n.type] || { icon: Bell, label: n.type, color: "bg-muted text-muted-foreground" };
              const Icon = config.icon;
              return (
                <Card
                  key={n.id}
                  className={`shadow-card transition-all ${!n.is_read ? "border-primary/20 bg-accent/30" : ""}`}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                >
                  <CardContent className="flex items-start gap-3 p-4 cursor-pointer">
                    <div className={`mt-0.5 rounded-lg p-2 ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{config.label}</span>
                        {!n.is_read && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className={`mt-0.5 text-sm ${!n.is_read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{n.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
