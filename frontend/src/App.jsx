import { useEffect, useState } from "react";

function App() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/times/1/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Erro ao buscar matches:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">ScoutMatch ⚽</h1>

      <div className="overflow-x-auto w-full max-w-4xl bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Compatibilidade</th>
              <th className="px-4 py-2">Resumo</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((jogador, index) => (
              <tr
                key={index}
                className="border-b even:bg-gray-100 odd:bg-white"
              >
                <td className="px-4 py-2">{jogador.nome}</td>
                <td className="px-4 py-2 font-bold text-center">
                  {jogador.compatibilidade}/5
                </td>
                <td className="px-4 py-2">{jogador.resumo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;