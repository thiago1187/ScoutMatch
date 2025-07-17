import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Target, TrendingUp, Star, MapPin, Calendar, Trophy, Zap, Eye, BarChart3, Clock, User, Shield, Heart, Crosshair } from 'lucide-react';

const ScoutMatchDashboard = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filterPosition, setFilterPosition] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('matches'); // matches, players, teams

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [jogadores, setJogadores] = useState([]);
  const [editingTime, setEditingTime] = useState(null);
  const [editingJogador, setEditingJogador] = useState(null);
  
  // ---------- opções fixas ----------
  const posicoes = ["Goleiro", "Zagueiro", "Lateral", "Meio-Campo", "Atacante"];
  const pernas   = ["Direita", "Esquerda", "Ambidestro"];
  const skills   = ["Drible", "Finalização", "Cabeceio", "Passe", "Desarme", "Velocidade"];
  const estilos  = ["Ofensivo", "Defensivo", "Equilibrado"];
  
  useEffect(() => {
    fetch('http://localhost:8080/times')
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Erro ao buscar times:", err));
  }, []);
  
  useEffect(() => {
    fetch('http://localhost:8080/jogadores')
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Erro ao buscar jogadores:", err));
  }, []);

  const calculateCompatibility = (player, team) => {
    let score = 0;
    let matches = [];
    
    if (player.posicao === team.posicaoDesejada) {
      score++;
      matches.push("posição");
    }
    if (player.pernaBoa === team.pernaDesejada) {
      score++;
      matches.push("perna");
    }
    if (player.melhorSkill === team.skillDesejada) {
      score++;
      matches.push("skill");
    }
    if (player.estiloDeJogo === team.estiloProcurado) {
      score++;
      matches.push("estilo");
    }
    if (player.idade >= team.minIdade && player.idade <= team.maxIdade) {
      score++;
      matches.push("idade");
    }
    
    return { score, matches, percentage: (score / 5) * 100 };
  };

  const getMatchesForTeam = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    
    return players.map(player => ({
      ...player,
      compatibility: calculateCompatibility(player, team)
    })).sort((a, b) => b.compatibility.score - a.compatibility.score);
  };

  const getCompatibilityColor = (score) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-blue-600 bg-blue-100';
    if (score >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityIcon = (score) => {
    if (score >= 4) return <Trophy className="w-4 h-4" />;
    if (score >= 3) return <Target className="w-4 h-4" />;
    if (score >= 2) return <Zap className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getSkillIcon = (skill) => {
    const icons = {
      'Cabeceio': <Shield className="w-4 h-4" />,
      'Finalização': <Target className="w-4 h-4" />,
      'Passe': <Crosshair className="w-4 h-4" />,
      'Drible': <Zap className="w-4 h-4" />,
      'Desarme': <Shield className="w-4 h-4" />,
      'Velocidade': <Zap className="w-4 h-4" />
    };
    return icons[skill] || <Star className="w-4 h-4" />;
  };

  const getAvatarBySkill = (skill) => {
    const avatars = {
      'Drible': '🏃',
      'Finalização': '⚽',
      'Cabeceio': '🦅',
      'Passe': '🎯',
      'Desarme': '🛡️',
      'Velocidade': '💨'
    };
    return avatars[skill] || '⚽';
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const novoJogador = Object.fromEntries(data);
    novoJogador.idade = parseInt(novoJogador.idade);
    novoJogador.avatar = getAvatarBySkill(novoJogador.melhorSkill); // Avatar automático baseado na skill
    fetch('http://localhost:8080/jogadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoJogador),
    })
    .then(() => {
      alert('Jogador criado!');
      setViewMode('players');
      // Recarregar lista de jogadores
      fetch('http://localhost:8080/jogadores')
        .then((res) => res.json())
        .then((data) => setPlayers(data));
    })
    .catch(() => alert('Erro ao criar jogador'));
  };

  const handleEditPlayer = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const jogadorEditado = Object.fromEntries(data);
    jogadorEditado.idade = parseInt(jogadorEditado.idade);
    jogadorEditado.avatar = getAvatarBySkill(jogadorEditado.melhorSkill);
    
    fetch(`http://localhost:8080/jogadores/${editingJogador.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jogadorEditado),
    })
    .then(() => {
      alert('Jogador editado!');
      setEditingJogador(null);
      setViewMode('players');
      // Recarregar lista de jogadores
      fetch('http://localhost:8080/jogadores')
        .then((res) => res.json())
        .then((data) => setPlayers(data));
    })
    .catch(() => alert('Erro ao editar jogador'));
  };

  const handleDeletePlayer = (playerId) => {
    if (confirm('Tem certeza que deseja excluir este jogador?')) {
      fetch(`http://localhost:8080/jogadores/${playerId}`, {
        method: 'DELETE',
      })
      .then(() => {
        alert('Jogador excluído!');
        // Recarregar lista de jogadores
        fetch('http://localhost:8080/jogadores')
          .then((res) => res.json())
          .then((data) => setPlayers(data));
      })
      .catch(() => alert('Erro ao excluir jogador'));
    }
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const novoTime = Object.fromEntries(data);
    novoTime.minIdade = parseInt(novoTime.minIdade);
    novoTime.maxIdade = parseInt(novoTime.maxIdade);
    novoTime.logo = "🏆"; // Logo padrão
    novoTime.cidade = "São Paulo"; // Cidade padrão
    fetch('http://localhost:8080/times', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoTime),
    })
    .then(() => {
      alert('Time criado!');
      setViewMode('teams');
      // Recarregar lista de times
      fetch('http://localhost:8080/times')
        .then((res) => res.json())
        .then((data) => setTeams(data));
    })
    .catch(() => alert('Erro ao criar time'));
  };

  const handleEditTeam = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const timeEditado = Object.fromEntries(data);
    timeEditado.minIdade = parseInt(timeEditado.minIdade);
    timeEditado.maxIdade = parseInt(timeEditado.maxIdade);
    timeEditado.logo = "🏆";
    timeEditado.cidade = "São Paulo";
    
    fetch(`http://localhost:8080/times/${editingTime.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeEditado),
    })
    .then(() => {
      alert('Time editado!');
      setEditingTime(null);
      setViewMode('teams');
      // Recarregar lista de times
      fetch('http://localhost:8080/times')
        .then((res) => res.json())
        .then((data) => setTeams(data));
    })
    .catch(() => alert('Erro ao editar time'));
  };

  const handleDeleteTeam = (teamId) => {
    if (confirm('Tem certeza que deseja excluir este time?')) {
      fetch(`http://localhost:8080/times/${teamId}`, {
        method: 'DELETE',
      })
      .then(() => {
        alert('Time excluído!');
        // Recarregar lista de times
        fetch('http://localhost:8080/times')
          .then((res) => res.json())
          .then((data) => setTeams(data));
      })
      .catch(() => alert('Erro ao excluir time'));
    }
  };

  const PlayerCard = ({ player, showCompatibility = false, team = null }) => {
    const compatibility = team ? calculateCompatibility(player, team) : null;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{player.avatar}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{player.nome}</h3>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {player.nacionalidade}
              </p>
            </div>
          </div>
          {showCompatibility && compatibility && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getCompatibilityColor(compatibility.score)}`}>
              {getCompatibilityIcon(compatibility.score)}
              {compatibility.score}/5
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Posição</div>
            <div className="font-semibold text-sm">{player.posicao}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Idade</div>
            <div className="font-semibold text-sm">{player.idade} anos</div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Perna boa:</span>
            <span className="font-semibold">{player.pernaBoa}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Melhor skill:</span>
            <span className="font-semibold flex items-center gap-1">
              {getSkillIcon(player.melhorSkill)}
              {player.melhorSkill}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estilo:</span>
            <span className="font-semibold">{player.estiloDeJogo}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <span>{player.altura} • {player.peso}</span>
          {showCompatibility && compatibility && (
            <span className="text-green-600 font-medium">
              {compatibility.percentage.toFixed(0)}% compatível
            </span>
          )}
        </div>
        
        {showCompatibility && compatibility && compatibility.matches.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-gray-600 mb-2">Critérios compatíveis:</div>
            <div className="flex flex-wrap gap-1">
              {compatibility.matches.map((match, index) => (
                <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  {match}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Botões de ação - só aparecem na aba jogadores */}
        {viewMode === 'players' && (
          <div className="mt-4 pt-3 border-t flex gap-2">
            <button
              onClick={() => setEditingJogador(player)}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeletePlayer(player.id)}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    );
  };

  const TeamCard = ({ team, onClick, isSelected = false }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'
      }`}
      onClick={() => onClick(team)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">{team.logo}</div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">{team.nome}</h3>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {team.cidade}
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">Procurando:</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Posição:</span>
            <span className="font-semibold">{team.posicaoDesejada}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Perna:</span>
            <span className="font-semibold">{team.pernaDesejada}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Skill:</span>
            <span className="font-semibold">{team.skillDesejada}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estilo:</span>
            <span className="font-semibold">{team.estiloProcurado}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Idade:</span>
            <span className="font-semibold">{team.minIdade}-{team.maxIdade} anos</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Fundado em {team.fundacao}</span>
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {getMatchesForTeam(team.id).filter(p => p.compatibility.score >= 3).length} matches
        </span>
      </div>
      
      {/* Botões de ação - só aparecem na aba times */}
      {viewMode === 'teams' && (
        <div className="mt-4 pt-3 border-t flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingTime(team);
            }}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTeam(team.id);
            }}
            className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );

  const Stats = () => {
    const totalMatches = teams.reduce((acc, team) => acc + getMatchesForTeam(team.id).length, 0);
    const highCompatibility = teams.reduce((acc, team) => 
      acc + getMatchesForTeam(team.id).filter(p => p.compatibility.score >= 4).length, 0
    );
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{teams.length}</div>
              <div className="text-blue-100">Times Ativos</div>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{players.length}</div>
              <div className="text-green-100">Jogadores</div>
            </div>
            <User className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalMatches}</div>
              <div className="text-purple-100">Total Matches</div>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{highCompatibility}</div>
              <div className="text-yellow-100">Alta Compatibilidade</div>
            </div>
            <Trophy className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                ⚽ <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ScoutMatch</span>
              </h1>
              <p className="text-gray-600 mt-2">Dashboard de Matches - Conectando jogadores e times</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('matches')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'matches' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Matches
              </button>
              <button
                onClick={() => setViewMode('players')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'players' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Jogadores
              </button>
              <button
                onClick={() => setViewMode('teams')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'teams' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Times
              </button>
              <button
                onClick={() => setViewMode('addPlayer')}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-500 text-white hover:bg-green-600"
              >
                + Adicionar Jogador
              </button>
              <button
                onClick={() => setViewMode('addTeam')}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-indigo-500 text-white hover:bg-indigo-600"
              >
                + Adicionar Time
              </button>
            </div>
          </div>
          
          <Stats />
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar jogadores ou times..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
              >
                <option value="all">Todas as posições</option>
                {posicoes.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'matches' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Teams List */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Times</h2>
              <div className="space-y-4">
                {teams.map(team => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={setSelectedTeam}
                    isSelected={selectedTeam?.id === team.id}
                  />
                ))}
              </div>
            </div>

            {/* Matches Results */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedTeam ? `Matches para ${selectedTeam.nome}` : 'Selecione um time'}
              </h2>
              
              {selectedTeam ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getMatchesForTeam(selectedTeam.id).map(player => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      showCompatibility={true}
                      team={selectedTeam}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Selecione um time para ver os matches
                  </h3>
                  <p className="text-gray-500">
                    Escolha um time da lista ao lado para visualizar os jogadores compatíveis
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'players' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Todos os Jogadores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players
                .filter(player => 
                  filterPosition === 'all' || player.posicao === filterPosition
                )
                .filter(player =>
                  player.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  player.posicao.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
            </div>
          </div>
        )}

        {viewMode === 'teams' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Todos os Times</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'addPlayer' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Jogador</h2>
            <form
              onSubmit={handleAddPlayer}
              className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-xl"
            >
              <input name="nome" required placeholder="Nome" className="w-full p-2 border rounded" />
              <input name="nacionalidade" required placeholder="Nacionalidade" className="w-full p-2 border rounded" />
              <input name="idade" type="number" required placeholder="Idade" className="w-full p-2 border rounded" />
              
              <select name="posicao" required className="w-full p-2 border rounded">
                <option value="">Selecione uma posição</option>
                {posicoes.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              
              <select name="pernaBoa" required className="w-full p-2 border rounded">
                <option value="">Selecione a perna boa</option>
                {pernas.map(perna => (
                  <option key={perna} value={perna}>{perna}</option>
                ))}
              </select>
              
              <select name="melhorSkill" required className="w-full p-2 border rounded">
                <option value="">Selecione a melhor skill</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              
              <select name="estiloDeJogo" required className="w-full p-2 border rounded">
                <option value="">Selecione o estilo de jogo</option>
                {estilos.map(estilo => (
                  <option key={estilo} value={estilo}>{estilo}</option>
                ))}
              </select>
              
              <input name="altura" placeholder="Altura (ex: 1.80m)" className="w-full p-2 border rounded" />
              <input name="peso" placeholder="Peso (ex: 75kg)" className="w-full p-2 border rounded" />
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Salvar Jogador</button>
            </form>
          </div>
        )}

        {editingJogador && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Editar Jogador</h2>
              <button
                onClick={() => setEditingJogador(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
            <form
              onSubmit={handleEditPlayer}
              className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-xl"
            >
              <input name="nome" required placeholder="Nome" defaultValue={editingJogador.nome} className="w-full p-2 border rounded" />
              <input name="nacionalidade" required placeholder="Nacionalidade" defaultValue={editingJogador.nacionalidade} className="w-full p-2 border rounded" />
              <input name="idade" type="number" required placeholder="Idade" defaultValue={editingJogador.idade} className="w-full p-2 border rounded" />
              
              <select name="posicao" required defaultValue={editingJogador.posicao} className="w-full p-2 border rounded">
                <option value="">Selecione uma posição</option>
                {posicoes.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              
              <select name="pernaBoa" required defaultValue={editingJogador.pernaBoa} className="w-full p-2 border rounded">
                <option value="">Selecione a perna boa</option>
                {pernas.map(perna => (
                  <option key={perna} value={perna}>{perna}</option>
                ))}
              </select>
              
              <select name="melhorSkill" required defaultValue={editingJogador.melhorSkill} className="w-full p-2 border rounded">
                <option value="">Selecione a melhor skill</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              
              <select name="estiloDeJogo" required defaultValue={editingJogador.estiloDeJogo} className="w-full p-2 border rounded">
                <option value="">Selecione o estilo de jogo</option>
                {estilos.map(estilo => (
                  <option key={estilo} value={estilo}>{estilo}</option>
                ))}
              </select>
              
              <input name="altura" placeholder="Altura (ex: 1.80m)" defaultValue={editingJogador.altura} className="w-full p-2 border rounded" />
              <input name="peso" placeholder="Peso (ex: 75kg)" defaultValue={editingJogador.peso} className="w-full p-2 border rounded" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Atualizar Jogador</button>
            </form>
          </div>
        )}

        {viewMode === 'addTeam' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Time</h2>
            <form
              onSubmit={handleAddTeam}
              className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-xl"
            >
              <input name="nome" required placeholder="Nome do Time" className="w-full p-2 border rounded" />
              <input name="fundacao" required placeholder="Fundação (ex: 1999)" className="w-full p-2 border rounded" />
              
              <select name="posicaoDesejada" required className="w-full p-2 border rounded">
                <option value="">Selecione a posição desejada</option>
                {posicoes.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              
              <select name="pernaDesejada" required className="w-full p-2 border rounded">
                <option value="">Selecione a perna desejada</option>
                {pernas.map(perna => (
                  <option key={perna} value={perna}>{perna}</option>
                ))}
              </select>
              
              <select name="skillDesejada" required className="w-full p-2 border rounded">
                <option value="">Selecione a skill desejada</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              
              <select name="estiloProcurado" required className="w-full p-2 border rounded">
                <option value="">Selecione o estilo procurado</option>
                {estilos.map(estilo => (
                  <option key={estilo} value={estilo}>{estilo}</option>
                ))}
              </select>
              
              <input name="minIdade" type="number" required placeholder="Idade mínima" className="w-full p-2 border rounded" />
              <input name="maxIdade" type="number" required placeholder="Idade máxima" className="w-full p-2 border rounded" />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Salvar Time</button>
            </form>
          </div>
        )}

        {editingTime && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Editar Time</h2>
              <button
                onClick={() => setEditingTime(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
            <form
              onSubmit={handleEditTeam}
              className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-xl"
            >
              <input name="nome" required placeholder="Nome do Time" defaultValue={editingTime.nome} className="w-full p-2 border rounded" />
              <input name="fundacao" required placeholder="Fundação (ex: 1999)" defaultValue={editingTime.fundacao} className="w-full p-2 border rounded" />
              
              <select name="posicaoDesejada" required defaultValue={editingTime.posicaoDesejada} className="w-full p-2 border rounded">
                <option value="">Selecione a posição desejada</option>
                {posicoes.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              
              <select name="pernaDesejada" required defaultValue={editingTime.pernaDesejada} className="w-full p-2 border rounded">
                <option value="">Selecione a perna desejada</option>
                {pernas.map(perna => (
                  <option key={perna} value={perna}>{perna}</option>
                ))}
              </select>
              
              <select name="skillDesejada" required defaultValue={editingTime.skillDesejada} className="w-full p-2 border rounded">
                <option value="">Selecione a skill desejada</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              
              <select name="estiloProcurado" required defaultValue={editingTime.estiloProcurado} className="w-full p-2 border rounded">
                <option value="">Selecione o estilo procurado</option>
                {estilos.map(estilo => (
                  <option key={estilo} value={estilo}>{estilo}</option>
                ))}
              </select>
              
              <input name="minIdade" type="number" required placeholder="Idade mínima" defaultValue={editingTime.minIdade} className="w-full p-2 border rounded" />
              <input name="maxIdade" type="number" required placeholder="Idade máxima" defaultValue={editingTime.maxIdade} className="w-full p-2 border rounded" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Atualizar Time</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoutMatchDashboard;