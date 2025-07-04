
import { useState, useEffect } from 'react';
import { TabNavigation } from './TabNavigation';
import { RankingTable } from './RankingTable';

interface Ranking {
  id: string;
  nome: string;
  url: string;
}

interface TeamData {
  nome: string;
  totalPontos: number;
}

const rankings: Ranking[] = [
  {
    id: 'ranking1',
    nome: 'ENSINO MÉDIO',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpEsWvBPW5lI63n_e9rLmrW2D9dVEKRAzGZMUu2eZa19Jge0FRWQIomelaLoLRS_gu0RnMscnTRpfg/pub?gid=322671126&single=true&output=csv'
  },
  {
    id: 'ranking2',
    nome: 'E.I. AO 2°ANO - MANHÃ',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpEsWvBPW5lI63n_e9rLmrW2D9dVEKRAzGZMUu2eZa19Jge0FRWQIomelaLoLRS_gu0RnMscnTRpfg/pub?gid=61558089&single=true&output=csv'
  },
  {
    id: 'ranking3',
    nome: 'E.I. AO 2°ANO - TARDE',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpEsWvBPW5lI63n_e9rLmrW2D9dVEKRAzGZMUu2eZa19Jge0FRWQIomelaLoLRS_gu0RnMscnTRpfg/pub?gid=48058987&single=true&output=csv'
  },
  {
    id: 'ranking4',
    nome: 'E.F. I - MANHÃ',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpEsWvBPW5lI63n_e9rLmrW2D9dVEKRAzGZMUu2eZa19Jge0FRWQIomelaLoLRS_gu0RnMscnTRpfg/pub?gid=1045355853&single=true&output=csv'
  },
  {
    id: 'ranking5',
    nome: 'E.F. I - TARDE',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpEsWvBPW5lI63n_e9rLmrW2D9dVEKRAzGZMUu2eZa19Jge0FRWQIomelaLoLRS_gu0RnMscnTRpfg/pub?gid=1874431184&single=true&output=csv'
  },
  {
    id: 'ranking6',
    nome: 'E.F. II - MANHÃ',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpEsWvBPW5lI63n_e9rLmrW2D9dVEKRAzGZMUu2eZa19Jge0FRWQIomelaLoLRS_gu0RnMscnTRpfg/pub?gid=201984363&single=true&output=csv'
  },
  {
    id: 'ranking7',
    nome: 'E.F. II - TARDE',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpEsWvBPW5lI63n_e9rLmrW2D9dVEKRAzGZMUu2eZa19Jge0FRWQIomelaLoLRS_gu0RnMscnTRpfg/pub?gid=484061672&single=true&output=csv'
  }
];

export const GincanaDasCores = () => {
  const [activeRankingId, setActiveRankingId] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<TeamData[]>([]);
  const [previousData, setPreviousData] = useState<TeamData[]>([]);
  const [status, setStatus] = useState('Selecione um ranking para começar.');
  const [isLoading, setIsLoading] = useState(false);
  const [lastDataCache, setLastDataCache] = useState<Record<string, TeamData[]>>({});

  const areDataEqual = (data1: TeamData[], data2: TeamData[]): boolean => {
    if (!data1 || !data2 || data1.length !== data2.length) return false;
    const data1Str = JSON.stringify(data1.map(d => `${d.nome}:${d.totalPontos}`).sort());
    const data2Str = JSON.stringify(data2.map(d => `${d.nome}:${d.totalPontos}`).sort());
    return data1Str === data2Str;
  };

  const loadRanking = async (rankingId: string, isAutoUpdate = false) => {
    const rankingInfo = rankings.find(r => r.id === rankingId);
    if (!rankingInfo) return;

    const cachedData = lastDataCache[rankingId];
    
    if (!isAutoUpdate) {
      setActiveRankingId(rankingId);
      if (cachedData) {
        setPreviousData(currentData);
        setCurrentData(cachedData);
        setStatus('Buscando atualizações...');
      } else {
        setCurrentData([]);
        setStatus('Buscando dados...');
      }
      setIsLoading(true);
    }

    try {
      const cacheBuster = `&t=${new Date().getTime()}`;
      const response = await fetch(rankingInfo.url + cacheBuster);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      
      const csvData = await response.text();
      const lines = csvData.trim().split('\n');
      
      if (lines.length <= 1) {
        if (!cachedData) {
          setStatus("Aguardando primeiros lançamentos.");
        }
        return;
      }
      
      lines.shift(); // Remove header
      
      const teamScores: Record<string, number> = {};
      lines.forEach(line => {
        const columns = line.split(',');
        if (columns.length >= 2) {
          const team = columns[0].trim().replace(/"/g, '');
          const score = parseFloat(columns[1].trim().replace(/"/g, ''));
          if (team && !isNaN(score)) {
            teamScores[team] = (teamScores[team] || 0) + score;
          }
        }
      });
      
      const newRanking = Object.keys(teamScores)
        .map(team => ({ nome: team, totalPontos: teamScores[team] }))
        .sort((a, b) => b.totalPontos - a.totalPontos);
      
      if (areDataEqual(newRanking, cachedData)) {
        setStatus('');
        setIsLoading(false);
        return;
      }
      
      setLastDataCache(prev => ({ ...prev, [rankingId]: newRanking }));
      setPreviousData(currentData);
      setCurrentData(newRanking);
      setStatus('');
      setIsLoading(false);
      
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      if (!cachedData) {
        setStatus('Falha ao buscar dados. Verifique a conexão.');
      } else {
        setStatus('Falha na atualização. Exibindo últimos dados válidos.');
      }
      setIsLoading(false);
    }
  };

  // Auto-update every 10 seconds
  useEffect(() => {
    if (!activeRankingId) return;
    
    const interval = setInterval(() => {
      loadRanking(activeRankingId, true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [activeRankingId]);

  // Initialize with first ranking
  useEffect(() => {
    if (rankings.length > 0) {
      loadRanking(rankings[0].id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-rainbow bg-400 animate-gradient overflow-x-hidden">
      <div className="w-[95%] max-w-6xl mx-auto p-5 md:p-8">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-5 md:p-8 border border-white/20">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="font-poppins font-extrabold italic text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-shadow-lg leading-tight mb-2">
              🎨 GINCANA DAS{' '}
              <span className="font-knewave not-italic">
                <span className="text-char-c">C</span>
                <span className="text-char-o">O</span>
                <span className="text-char-r">R</span>
                <span className="text-char-e">E</span>
                <span className="text-char-s">S</span>
              </span>{' '}
              🎨
            </h1>
            <div className="font-poppins font-semibold text-white/85 text-sm sm:text-base md:text-xl">
              CACH 2025
            </div>
          </header>

          {/* Navigation */}
          <TabNavigation
            rankings={rankings}
            activeRankingId={activeRankingId}
            onRankingSelect={loadRanking}
          />

          {/* Status */}
          <div className="text-center text-white/80 font-medium italic text-sm md:text-lg min-h-[25px] mb-6 transition-opacity duration-500">
            {status}
          </div>

          {/* Ranking Table */}
          <RankingTable
            currentData={currentData}
            previousData={previousData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
