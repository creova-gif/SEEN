import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-5"
    >
      <div>
        <h2 className="text-xl tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-white/40 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <button className="flex items-center gap-1 text-xs tracking-wider uppercase text-white/50 hover:text-white/80 transition-colors">
        See All
        <ChevronRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
