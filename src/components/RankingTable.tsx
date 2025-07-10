
import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface TeamData {
  nome: string;
  totalPontos: number;
}

interface RankingTableProps {
  currentData: TeamData[];
  previousData: TeamData[];
  isLoading: boolean;
  showDetails?: boolean;
}

export const RankingTable: React.FC<RankingTableProps> = ({
  currentData,
  previousData,
  isLoading,
  showDetails = false
}) => {
  const [animatedRows, setAnimatedRows] = useState<Set<string>>(new Set());

  const detectTeamColorClass = (teamName: string): string => {
    const name = teamName.toLowerCase();
    if (name.includes('azul')) return 'text-turma-azul';
    if (name.includes('amarelo')) return 'text-turma-amarelo';
    if (name.includes('branco')) return 'text-turma-branco';
    if (name.includes('vermelho')) return 'text-turma-vermelho';
    if (name.includes('verde')) return 'text-turma-verde';
    if (name.includes('laranja')) return 'text-turma-laranja';
    if (name.includes('rosa')) return 'text-turma-rosa';
    if (name.includes('roxo')) return 'text-turma-roxo';
    if (name.includes('violeta')) return 'text-turma-violeta';
    if (name.includes('preto')) return 'text-turma-preto';
    if (name.includes('cinza')) return 'text-turma-cinza';
    if (name.includes('marrom')) return 'text-turma-marrom';
    return 'text-white';
  };

  const getMovementClass = (teamName: string, currentIndex: number): string => {
    if (!previousData.length) return '';
    
    const previousIndex = previousData.findIndex(team => team.nome === teamName);
    if (previousIndex === -1 || previousIndex === currentIndex) return '';
    
    return previousIndex > currentIndex ? 'animate-rank-up' : 'animate-rank-down';
  };

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />;
      default:
        return null;
    }
  };

  const getPodiumClass = (position: number): string => {
    switch (position) {
      case 0:
        return 'animate-gold-glow';
      case 1:
        return 'animate-silver-glow';
      case 2:
        return 'animate-bronze-glow';
      default:
        return '';
    }
  };

  // Track animations
  useEffect(() => {
    if (!previousData.length || !currentData.length) return;

    const newAnimatedRows = new Set<string>();
    currentData.forEach((team, index) => {
      const previousIndex = previousData.findIndex(prev => prev.nome === team.nome);
      if (previousIndex !== -1 && previousIndex !== index) {
        newAnimatedRows.add(team.nome);
      }
    });

    setAnimatedRows(newAnimatedRows);

    // Clear animations after delay
    const timer = setTimeout(() => {
      setAnimatedRows(new Set());
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentData, previousData]);

  if (isLoading && !currentData.length) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!currentData.length) {
    return (
      <div className="text-center text-white/60 py-12">
        <p className="text-lg">Nenhum dado encontrado na planilha.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-black/25 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/30 border-b border-white/10">
              <th className="px-3 py-4 md:px-6 md:py-5 font-semibold text-white text-sm md:text-lg">
                Posição
              </th>
              <th className="px-3 py-4 md:px-6 md:py-5 font-semibold text-white text-sm md:text-lg">
                Turma
              </th>
              {showDetails && (
                <th className="px-3 py-4 md:px-6 md:py-5 font-semibold text-white text-sm md:text-lg text-right">
                  Pontuação
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((team, index) => {
              const teamColorClass = detectTeamColorClass(team.nome);
              const movementClass = animatedRows.has(team.nome) 
                ? getMovementClass(team.nome, index) 
                : '';
              const podiumClass = getPodiumClass(index);
              const podiumIcon = getPodiumIcon(index);
              
              return (
                <tr
                  key={team.nome}
                  className={`
                    border-b border-white/5 last:border-b-0
                    transition-all duration-1500 ease-in-out
                    hover:bg-white/5
                    ${movementClass}
                    ${podiumClass}
                  `}
                >
                  <td className={`px-3 py-4 md:px-6 md:py-5 font-bold ${teamColorClass} text-sm md:text-lg`}>
                    <div className="flex items-center gap-2">
                      {podiumIcon}
                      {index + 1}º
                    </div>
                  </td>
                  <td className={`px-3 py-4 md:px-6 md:py-5 font-bold ${teamColorClass} text-sm md:text-lg`}>
                    <div className="truncate max-w-[200px] md:max-w-none">
                      {team.nome}
                    </div>
                  </td>
                  {showDetails && (
                    <td className={`px-3 py-4 md:px-6 md:py-5 font-bold ${teamColorClass} text-sm md:text-lg text-right`}>
                      {team.totalPontos}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
