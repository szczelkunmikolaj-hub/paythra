import { getIconForSubscription } from "@/lib/categoryIcons";

interface SubscriptionIconProps {
  name: string;
  category: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { container: "h-8 w-8", icon: "h-4 w-4" },
  md: { container: "h-10 w-10", icon: "h-5 w-5" },
  lg: { container: "h-12 w-12", icon: "h-6 w-6" },
};

const SubscriptionIcon = ({ name, category, size = "md" }: SubscriptionIconProps) => {
  const config = getIconForSubscription(name, category);
  const Icon = config.icon;
  const s = sizeMap[size];

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-xl ${config.bgColor} ${s.container}`}>
      <Icon className={`${config.color} ${s.icon}`} />
    </div>
  );
};

export default SubscriptionIcon;
