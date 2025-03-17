import React from 'react';
import { Award, Star, Sparkles, Crown } from 'lucide-react';

interface LoyaltyBadgeProps {
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  onClick: () => void;
}

const LoyaltyBadge: React.FC<LoyaltyBadgeProps> = ({ points, level, onClick }) => {
  const badges = {
    bronze: { icon: Star, color: 'amber-600', bg: 'amber-100' },
    silver: { icon: Award, color: 'slate-400', bg: 'slate-100' },
    gold: { icon: Sparkles, color: 'yellow-600', bg: 'yellow-100' },
    platinum: { icon: Crown, color: 'indigo-600', bg: 'indigo-100' }
  };

  const BadgeIcon = badges[level].icon;

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-2 px-3 py-1.5 rounded-full
        border border-${badges[level].color}/20
        bg-${badges[level].bg}
        hover:bg-${badges[level].color}/20
        transition
      `}
    >
      <BadgeIcon className={`w-4 h-4 text-${badges[level].color}`} />
      <span className={`text-sm font-medium text-${badges[level].color}`}>
        {points.toLocaleString()} pts
      </span>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-slate-800 text-white text-xs py-1 px-2 rounded">
          {level.charAt(0).toUpperCase() + level.slice(1)} Member
        </div>
        <div className="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>
    </button>
  );
};

export default LoyaltyBadge;