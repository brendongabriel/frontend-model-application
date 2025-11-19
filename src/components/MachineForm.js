import React, { useState } from "react";
import { createMachine } from "../api/api";

const MachineForm = () => {
  const [machineName, setMachineName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createMachine(machineName);
      setMessage(`Maquina criado com sucesso: ${result.machine_name}`);
    } catch (error) {
      setMessage("Erro ao criar o Maquina");
    }
  };

  return (
    <div>
      <h2>Criar Novo Maquina</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="machineName">Nome do Maquina:</label>
        <input
          type="text"
          id="machineName"
          value={machineName}
          onChange={(e) => setMachineName(e.target.value)}
        />
        <button type="submit">Criar Maquina</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MachineForm;
