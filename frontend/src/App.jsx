import { useEffect, useState } from "react";

function App() {
  // ---------- state ----------
  const [times, setTimes] = useState([]);
  const [selectedTimeId, setSelectedTimeId] = useState("");
  const [matches, setMatches] = useState([]);

  const [timeForm, setTimeForm] = useState({
    nome: "",
    posicaoDesejada: "",
    pernaDesejada: "",
    skillDesejada: "",
    estiloProcurado: "",
    minIdade: "",
    maxIdade: "",
  });

  const [jogadorForm, setJogadorForm] = useState({
    nome: "",
    posicao: "",
    pernaBoa: "",
    melhorSkill: "",
    estiloDeJogo: "",
    idade: "",
  });

  const [jogadores, setJogadores] = useState([]);
  const [editingTime, setEditingTime] = useState(null);
  const [editingJogador, setEditingJogador] = useState(null);
  // ---------- opções fixas ----------
  const posicoes = ["Goleiro", "Zagueiro", "Lateral", "Meio-Campo", "Atacante"];
  const pernas   = ["Direita", "Esquerda", "Ambidestro"];
  const skills   = ["Drible", "Finalização", "Cabeceio", "Passe", "Desarme", "Velocidade"];
  const estilos  = ["Ofensivo", "Defensivo", "Equilibrado"];

  const camposPreenchidos = (obj) => Object.values(obj).every((v) => v !== "");

  const carregarTimes = () => {
    fetch("http://localhost:8080/times")
      .then((r) => r.json())
      .then(setTimes)
      .catch(console.error);
  };

const carregarJogadores = () => {
  fetch("http://localhost:8080/jogadores")
    .then((r) => r.json())
    .then(setJogadores)
    .catch(console.error);
};

// ---------- efeitos ----------
useEffect(carregarTimes, []);
useEffect(carregarJogadores, []);

  useEffect(() => {
    if (!selectedTimeId) return;
    fetch(`http://localhost:8080/times/${selectedTimeId}/matches`)
      .then((r) => r.json())
      .then(setMatches)
      .catch(console.error);
  }, [selectedTimeId]);

  // ---------- handlers ----------
  const handleSubmitTime = async (e) => {
    e.preventDefault();
    if (!camposPreenchidos(timeForm)) return alert("Preencha todos os campos do time!");

    try {
      const res = await fetch("http://localhost:8080/times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeForm),
      });
      if (!res.ok) throw new Error(await res.text());

      await res.json();
      carregarTimes();
      alert("Time criado com sucesso!");
      setTimeForm({
        nome: "", posicaoDesejada: "", pernaDesejada: "", skillDesejada: "",
        estiloProcurado: "", minIdade: "", maxIdade: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro criando time (veja console).");
    }
  };

  const handleSubmitJogador = async (e) => {
    e.preventDefault();
    if (!camposPreenchidos(jogadorForm)) return alert("Preencha todos os campos do jogador!");

    const payload = { ...jogadorForm, idade: Number(jogadorForm.idade) };

    try {
      const res = await fetch("http://localhost:8080/jogadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());

      alert("Jogador criado com sucesso!");
      setJogadorForm({
        nome: "", posicao: "", pernaBoa: "", melhorSkill: "",
        estiloDeJogo: "", idade: "",
      });
      carregarJogadores();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar jogador (veja console).");
    }
  };
  const handleDeleteTime = async (id) => {
    if (!confirm("Excluir time?")) return;
    await fetch(`http://localhost:8080/times/${id}`, { method: "DELETE" });
    carregarTimes();
    if (String(id) === selectedTimeId) {
      setSelectedTimeId("");
      setMatches([]);
    }
  };

  const handleDeleteJogador = async (id) => {
    if (!confirm("Excluir jogador?")) return;
    await fetch(`http://localhost:8080/jogadores/${id}`, { method: "DELETE" });
    carregarJogadores();
  };

  const handleUpdateTime = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/times/${editingTime.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTime),
    });
    if (res.ok) {
      setEditingTime(null);
      carregarTimes();
    } else {
      alert("Erro ao atualizar time");
    }
  };

  const handleUpdateJogador = async (e) => {
    e.preventDefault();
    const payload = { ...editingJogador, idade: Number(editingJogador.idade) };
    const res = await fetch(`http://localhost:8080/jogadores/${editingJogador.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditingJogador(null);
      carregarJogadores();
    } else {
      alert("Erro ao atualizar jogador");
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">ScoutMatch ⚽</h1>

      {/* seletor de time */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Escolha um time:</label>
        <select
          value={selectedTimeId}
          onChange={(e) => setSelectedTimeId(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">-- Selecione --</option>
          {times.map((t) => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </select>
      </div>

      {/* tabela de matches */}
      {matches.length > 0 && (
        <div className="w-full max-w-4xl mb-8 bg-white shadow rounded">
          <table className="w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2 text-center">Compatibilidade</th>
                <th className="px-4 py-2">Resumo</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((j) => (
                <tr key={j.nome} className="border-b odd:bg-gray-50">
                  <td className="px-4 py-2">{j.nome}</td>
                  <td className="px-4 py-2 text-center font-bold">{j.compatibilidade}/5</td>
                  <td className="px-4 py-2">{j.resumo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* lista de times */}
      <div className="bg-white shadow rounded p-4 w-full max-w-2xl mb-8">
        <h2 className="font-bold mb-2">Times</h2>
        {times.map((t) => (
          <div key={t.id} className="flex justify-between border-b py-1">
            <span>{t.nome}</span>
            <div>
              <button onClick={() => setEditingTime({ ...t })} className="text-blue-600 mr-2">Editar</button>
              <button onClick={() => handleDeleteTime(t.id)} className="text-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {/* lista de jogadores */}
      <div className="bg-white shadow rounded p-4 w-full max-w-2xl mb-8">
        <h2 className="font-bold mb-2">Jogadores</h2>
        {jogadores.map((j) => (
          <div key={j.id} className="flex justify-between border-b py-1">
            <span>{j.nome}</span>
            <div>
              <button onClick={() => setEditingJogador({ ...j })} className="text-blue-600 mr-2">Editar</button>
              <button onClick={() => handleDeleteJogador(j.id)} className="text-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>


      {/* formulário de time */}
      <form onSubmit={handleSubmitTime} className="bg-white shadow rounded p-6 w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Criar Time</h2>

        <input className="input" placeholder="Nome" value={timeForm.nome}
          onChange={(e) => setTimeForm({ ...timeForm, nome: e.target.value })} />

        <select className="input" value={timeForm.posicaoDesejada}
          onChange={(e) => setTimeForm({ ...timeForm, posicaoDesejada: e.target.value })}>
          <option value="">Posição desejada</option>
          {posicoes.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select className="input" value={timeForm.pernaDesejada}
          onChange={(e) => setTimeForm({ ...timeForm, pernaDesejada: e.target.value })}>
          <option value="">Perna desejada</option>
          {pernas.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select className="input" value={timeForm.skillDesejada}
          onChange={(e) => setTimeForm({ ...timeForm, skillDesejada: e.target.value })}>
          <option value="">Skill desejada</option>
          {skills.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select className="input" value={timeForm.estiloProcurado}
          onChange={(e) => setTimeForm({ ...timeForm, estiloProcurado: e.target.value })}>
          <option value="">Estilo procurado</option>
          {estilos.map((s) => <option key={s}>{s}</option>)}
        </select>

        <input className="input" type="number" placeholder="Idade mínima" value={timeForm.minIdade}
          onChange={(e) => setTimeForm({ ...timeForm, minIdade: e.target.value })} />

        <input className="input" type="number" placeholder="Idade máxima" value={timeForm.maxIdade}
          onChange={(e) => setTimeForm({ ...timeForm, maxIdade: e.target.value })} />

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">
          Criar Time
        </button>
      </form>

      {/* formulário de jogador */}
      <form onSubmit={handleSubmitJogador} className="bg-white shadow rounded p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-green-700 mb-4">Criar Jogador</h2>

        <input className="input" placeholder="Nome" value={jogadorForm.nome}
          onChange={(e) => setJogadorForm({ ...jogadorForm, nome: e.target.value })} />

        <select className="input" value={jogadorForm.posicao}
          onChange={(e) => setJogadorForm({ ...jogadorForm, posicao: e.target.value })}>
          <option value="">Posição</option>
          {posicoes.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select className="input" value={jogadorForm.pernaBoa}
          onChange={(e) => setJogadorForm({ ...jogadorForm, pernaBoa: e.target.value })}>
          <option value="">Perna boa</option>
          {pernas.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select className="input" value={jogadorForm.melhorSkill}
          onChange={(e) => setJogadorForm({ ...jogadorForm, melhorSkill: e.target.value })}>
          <option value="">Melhor Skill</option>
          {skills.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select className="input" value={jogadorForm.estiloDeJogo}
          onChange={(e) => setJogadorForm({ ...jogadorForm, estiloDeJogo: e.target.value })}>
          <option value="">Estilo de jogo</option>
          {estilos.map((s) => <option key={s}>{s}</option>)}
        </select>

        <input className="input" type="number" placeholder="Idade" value={jogadorForm.idade}
          onChange={(e) => setJogadorForm({ ...jogadorForm, idade: e.target.value })} />

        <button type="submit" className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded">
          Criar Jogador
        </button>
      </form>
      
      {editingTime && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdateTime} className="modal">
            <h2 className="text-xl font-bold mb-4">Editar Time</h2>
            <input className="input" value={editingTime.nome}
              onChange={(e) => setEditingTime({ ...editingTime, nome: e.target.value })} />
            <select className="input" value={editingTime.posicaoDesejada}
              onChange={(e) => setEditingTime({ ...editingTime, posicaoDesejada: e.target.value })}>
              <option value="">Posição desejada</option>
              {posicoes.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="input" value={editingTime.pernaDesejada}
              onChange={(e) => setEditingTime({ ...editingTime, pernaDesejada: e.target.value })}>
              <option value="">Perna desejada</option>
              {pernas.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="input" value={editingTime.skillDesejada}
              onChange={(e) => setEditingTime({ ...editingTime, skillDesejada: e.target.value })}>
              <option value="">Skill desejada</option>
              {skills.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="input" value={editingTime.estiloProcurado}
              onChange={(e) => setEditingTime({ ...editingTime, estiloProcurado: e.target.value })}>
              <option value="">Estilo procurado</option>
              {estilos.map(s => <option key={s}>{s}</option>)}
            </select>
            <input className="input" type="number" value={editingTime.minIdade}
              onChange={(e) => setEditingTime({ ...editingTime, minIdade: e.target.value })} placeholder="Idade mínima" />
            <input className="input" type="number" value={editingTime.maxIdade}
              onChange={(e) => setEditingTime({ ...editingTime, maxIdade: e.target.value })} placeholder="Idade máxima" />
            <button className="w-full bg-blue-500 text-white py-2 rounded">Salvar</button>
            <button type="button" onClick={() => setEditingTime(null)} className="w-full mt-2 bg-gray-300 py-2 rounded">Cancelar</button>
          </form>
        </div>
      )}

      {editingJogador && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdateJogador} className="modal">
            <h2 className="text-xl font-bold mb-4">Editar Jogador</h2>
            <input className="input" value={editingJogador.nome}
              onChange={(e) => setEditingJogador({ ...editingJogador, nome: e.target.value })} />
            <select className="input" value={editingJogador.posicao}
              onChange={(e) => setEditingJogador({ ...editingJogador, posicao: e.target.value })}>
              <option value="">Posição</option>
              {posicoes.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="input" value={editingJogador.pernaBoa}
              onChange={(e) => setEditingJogador({ ...editingJogador, pernaBoa: e.target.value })}>
              <option value="">Perna boa</option>
              {pernas.map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="input" value={editingJogador.melhorSkill}
              onChange={(e) => setEditingJogador({ ...editingJogador, melhorSkill: e.target.value })}>
              <option value="">Melhor Skill</option>
              {skills.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="input" value={editingJogador.estiloDeJogo}
              onChange={(e) => setEditingJogador({ ...editingJogador, estiloDeJogo: e.target.value })}>
              <option value="">Estilo de jogo</option>
              {estilos.map(s => <option key={s}>{s}</option>)}
            </select>
            <input className="input" type="number" value={editingJogador.idade}
              onChange={(e) => setEditingJogador({ ...editingJogador, idade: e.target.value })} placeholder="Idade" />
            <button className="w-full bg-green-500 text-white py-2 rounded">Salvar</button>
            <button type="button" onClick={() => setEditingJogador(null)} className="w-full mt-2 bg-gray-300 py-2 rounded">Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}

/* tailwind “input” utilitária */
const inputClasses = "w-full mb-2 px-3 py-2 border rounded";
export default App;
