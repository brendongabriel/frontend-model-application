import React, { useState } from "react";
import { getMachineRanking } from "../api/api";

const Ranking = () => {
  const [machineId, setMachineId] = useState("");
  const [ranking, setRanking] = useState([]);
  const [message, setMessage] = useState("");

  const handleGetRanking = async () => {
    try {
      const result = await getMachineRanking(machineId);
      setRanking(result.ranking || []);
    } catch (error) {
      setMessage("Erro ao buscar o ranking");
    }
  };

  return (
    <div>
      <h2>Obter Ranking da Maquina</h2>
      <input
        type="number"
        placeholder="ID do Maquina"
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
      />
      <button onClick={handleGetRanking}>Obter Ranking</button>

      {message && <p>{message}</p>}
      {ranking.length > 0 && (
        <ul>
          {ranking.map((item, index) => (
            <li key={index}>
              {item.feature}: {item.importance}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ranking;
