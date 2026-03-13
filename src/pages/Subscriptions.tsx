import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import SubscriptionForm from "@/components/dashboard/SubscriptionForm";
import { useSubscriptions, type Subscription } from "@/hooks/useSubscriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, CreditCard } from "lucide-react";

const Subscriptions = () => {
  const { subscriptions, isLoading, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = subscriptions.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleEdit = (sub: Subscription) => {
    setEditing(sub);
    setFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Subscriptions</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search subscriptions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="streaming">Streaming</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <CreditCard className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">{search || categoryFilter !== "all" ? "No matching subscriptions" : "No subscriptions yet"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} onEdit={handleEdit} onDelete={deleteSubscription} />
            ))}
          </div>
        )}

        <SubscriptionForm open={formOpen} onOpenChange={setFormOpen} onSubmit={addSubscription} onUpdate={updateSubscription} editing={editing} />
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;
