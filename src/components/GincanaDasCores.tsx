
import { useState, useEffect } from 'react';
import { TabNavigation } from './TabNavigation';
import { RankingTable } from './RankingTable';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

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
  const [status, setStatus] = useState('Carregando dados...');
  const [isLoading, setIsLoading] = useState(false);
  const [lastDataCache, setLastDataCache] = useState<Record<string, TeamData[]>>({});
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [viewportConfig, setViewportConfig] = useState(false);
  const [inputBuffer, setInputBuffer] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');

  // Função para verificar se dois arrays de dados são iguais
  const areDataEqual = (data1: TeamData[], data2: TeamData[]): boolean => {
    if (!data1 || !data2 || data1.length !== data2.length) return false;
    const data1Str = JSON.stringify(data1.map(d => `${d.nome}:${d.totalPontos}`).sort());
    const data2Str = JSON.stringify(data2.map(d => `${d.nome}:${d.totalPontos}`).sort());
    return data1Str === data2Str;
  };

  // Função principal para carregar dados do ranking
  const loadRanking = async (rankingId: string, isAutoUpdate = false) => {
    console.log(`Loading ranking ${rankingId}, isAutoUpdate: ${isAutoUpdate}`);
    
    const rankingInfo = rankings.find(r => r.id === rankingId);
    if (!rankingInfo) {
      console.error(`Ranking ${rankingId} not found`);
      return;
    }

    const cachedData = lastDataCache[rankingId];
    
    if (!isAutoUpdate) {
      setActiveRankingId(rankingId);
      if (cachedData && cachedData.length > 0) {
        setPreviousData(currentData);
        setCurrentData(cachedData);
        setStatus('Buscando atualizações...');
      } else {
        setCurrentData([]);
        setStatus('Carregando dados...');
      }
      setIsLoading(true);
    }

    try {
      // Adiciona cache buster para forçar atualização
      const timestamp = new Date().getTime();
      const urlWithCacheBuster = `${rankingInfo.url}&cb=${timestamp}`;
      
      console.log(`Fetching data from: ${urlWithCacheBuster}`);
      
      const response = await fetch(urlWithCacheBuster, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvData = await response.text();
      console.log(`CSV data received, length: ${csvData.length}`);
      
      const lines = csvData.trim().split('\n');
      
      if (lines.length <= 1) {
        console.log('No data found in CSV');
        if (!cachedData || cachedData.length === 0) {
          setStatus("Aguardando primeiros dados...");
          setCurrentData([]);
        } else {
          setStatus('');
        }
        setIsLoading(false);
        return;
      }
      
      // Remove header
      lines.shift();
      
      const teamScores: Record<string, number> = {};
      lines.forEach((line, index) => {
        const columns = line.split(',');
        if (columns.length >= 2) {
          const team = columns[0].trim().replace(/"/g, '');
          const scoreStr = columns[1].trim().replace(/"/g, '');
          const score = parseFloat(scoreStr);
          
          if (team && !isNaN(score)) {
            teamScores[team] = (teamScores[team] || 0) + score;
          }
        }
      });
      
      const newRanking = Object.keys(teamScores)
        .map(team => ({ nome: team, totalPontos: teamScores[team] }))
        .sort((a, b) => b.totalPontos - a.totalPontos);
      
      console.log(`Processed ${newRanking.length} teams`);
      
      // Verifica se os dados mudaram
      if (areDataEqual(newRanking, cachedData)) {
        console.log('Data unchanged');
        setStatus('');
        setIsLoading(false);
        return;
      }
      
      console.log('Data changed, updating state');
      
      // Atualiza o cache e estado
      setLastDataCache(prev => ({ ...prev, [rankingId]: newRanking }));
      setPreviousData(currentData.length > 0 ? currentData : cachedData || []);
      setCurrentData(newRanking);
      setStatus('');
      setIsLoading(false);
      setLastUpdateTime(new Date());
      
    } catch (error) {
      console.error('Error loading ranking:', error);
      
      if (!cachedData || cachedData.length === 0) {
        setStatus('Erro ao carregar dados. Tentando novamente...');
        setCurrentData([]);
      } else {
        setStatus('Erro na atualização. Exibindo dados em cache.');
      }
      setIsLoading(false);
    }
  };

  // Auto-update a cada 15 segundos
  useEffect(() => {
    if (!activeRankingId) return;
    
    console.log(`Setting up auto-update for ${activeRankingId}`);
    
    const interval = setInterval(() => {
      console.log('Auto-update triggered');
      loadRanking(activeRankingId, true);
    }, 15000); // 15 segundos
    
    return () => {
      console.log('Clearing auto-update interval');
      clearInterval(interval);
    };
  }, [activeRankingId, currentData]);

  // Sistema de controle especial
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const targetSeq = ['c', 'a', 'c', 'h', '.', 'a', 'd', 'm', 'i', 'n'];
      const newBuffer = [...inputBuffer, e.key.toLowerCase()].slice(-10);
      setInputBuffer(newBuffer);
      
      if (newBuffer.join('') === targetSeq.join('')) {
        setViewportConfig(prev => !prev);
        setInputBuffer([]);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputBuffer]);

  // Carrega o primeiro ranking ao inicializar
  useEffect(() => {
    console.log('Component mounted, loading first ranking');
    if (rankings.length > 0) {
      loadRanking(rankings[0].id);
    }
  }, []);

  // Atualiza status com horário da última atualização
  const getStatusText = () => {
    if (status) return status;
    if (lastUpdateTime) {
      return `Última atualização: ${lastUpdateTime.toLocaleTimeString()}`;
    }
    return '';
  };

  // Funções para o modal de admin
  const handlePaintClick = () => {
    setShowModal(true);
  };

  const handlePasswordSubmit = () => {
    if (password === 'cach.admin') {
      setViewportConfig(true);
      setShowModal(false);
      setPassword('');
    } else if (password === 'aluno') {
      setViewportConfig(false);
      setShowModal(false);
      setPassword('');
    } else {
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-rainbow bg-400 animate-gradient overflow-x-hidden">
      <div className="w-[95%] max-w-6xl mx-auto p-5 md:p-8">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-5 md:p-8 border border-white/20">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="font-poppins font-extrabold italic text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-shadow-lg leading-tight mb-2">
              <span 
                onClick={handlePaintClick}
                className="cursor-pointer hover:scale-110 transition-transform duration-200 inline-block"
                title=""
              >
                🎨
              </span>{' '}
              GINCANA DAS{' '}
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
            {getStatusText()}
          </div>

          {/* Ranking Table */}
          <RankingTable
            currentData={currentData}
            previousData={previousData}
            isLoading={isLoading}
            showDetails={viewportConfig}
          />
        </div>
      </div>

      {/* Modal de Autenticação */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-black/90 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Acesso ao Sistema</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Digite o código"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              autoFocus
            />
            <Button 
              onClick={handlePasswordSubmit}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
