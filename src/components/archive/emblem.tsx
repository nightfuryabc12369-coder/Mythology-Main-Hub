import type { Emblem } from "@/data/types";
import {
  Crown,
  Feather,
  Flame,
  Flower2,
  Grape,
  Hammer,
  KeyRound,
  Moon,
  Shell,
  Shield,
  Signpost,
  Sun,
  Swords,
  Waves,
  Wheat,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";

const icons: Record<Emblem, LucideIcon> = {
  bolt: Zap,
  crown: Crown,
  wave: Waves,
  wheat: Wheat,
  shield: Shield,
  sun: Sun,
  moon: Moon,
  swords: Swords,
  shell: Shell,
  hammer: Hammer,
  feather: Feather,
  grape: Grape,
  key: KeyRound,
  flower: Flower2,
  flame: Flame,
  crossroad: Signpost,
  wine: Wine,
};

export function EmblemMark({ name, className }: { name: Emblem; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden />;
}
