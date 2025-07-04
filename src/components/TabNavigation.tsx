
import React from 'react';

interface Ranking {
  id: string;
  nome: string;
  url: string;
}

interface TabNavigationProps {
  rankings: Ranking[];
  activeRankingId: string | null;
  onRankingSelect: (rankingId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  rankings,
  activeRankingId,
  onRankingSelect
}) => {
  return (
    <div className="border-b-2 border-white/20 mb-6 pb-4">
      <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide pb-3">
        {rankings.map((ranking) => (
          <button
            key={ranking.id}
            onClick={() => onRankingSelect(ranking.id)}
            className={`
              px-4 py-3 md:px-6 md:py-4 
              text-xs sm:text-sm md:text-base
              font-medium rounded-t-lg 
              border-2 border-transparent 
              transition-all duration-200 
              flex-shrink-0 whitespace-nowrap
              ${
                activeRankingId === ranking.id
                  ? 'text-white border-white/20 border-b-transparent bg-black/20 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {ranking.nome}
          </button>
        ))}
      </div>
    </div>
  );
};
