import {
  TrendingUp,
  MessageCircle,
  FileSearch,
  Network,
  RefreshCw,
  SlidersHorizontal,
  Landmark,
  ShoppingBag,
  Leaf,
  Globe,
  HeartPulse,
  Building2,
  Factory,
  BookOpen,
  type LucideProps,
} from "lucide-react";

const SOLUTION_ICONS: Record<string, React.ComponentType<LucideProps>> = {
  chart: TrendingUp,
  chat: MessageCircle,
  document: FileSearch,
  network: Network,
  automation: RefreshCw,
  settings: SlidersHorizontal,
};

const SECTOR_ICONS: Record<string, React.ComponentType<LucideProps>> = {
  bank: Landmark,
  shop: ShoppingBag,
  plant: Leaf,
  globe: Globe,
  health: HeartPulse,
  government: Building2,
  factory: Factory,
  book: BookOpen,
};

type SolutionIconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function SolutionIcon({ name, size = 20, color = "var(--haiti-blue)", strokeWidth = 1.5 }: SolutionIconProps) {
  const Icon = SOLUTION_ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export function SectorIcon({ name, size = 16, color = "var(--haiti-blue)", strokeWidth = 1.5 }: SolutionIconProps) {
  const Icon = SECTOR_ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} aria-hidden="true" />;
}
