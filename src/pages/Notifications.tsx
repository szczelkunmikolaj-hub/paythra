import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck, AlertTriangle, Clock, CreditCard } from "lucide-react";

const typeIcons: Record<string, typeof Bell> = {
  upcoming_charge: CreditCard,
  trial_ending: Clock,
  unused_subscription: AlertTriangle,
  price_increase: AlertTriangle,
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
              const Icon = typeIcons[n.type] || Bell;
              return (
                <Card
                  key={n.id}
                  className={`shadow-card transition-all ${!n.is_read ? "border-primary/20 bg-accent/30" : ""}`}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                >
                  <CardContent className="flex items-start gap-3 p-4 cursor-pointer">
                    <div className={`mt-0.5 rounded-lg p-2 ${!n.is_read ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`h-4 w-4 ${!n.is_read ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!n.is_read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{n.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!n.is_read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
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
