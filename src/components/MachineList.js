import React, { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_URL_BASE;

const MachineList = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/machines/`);
        setMachines(response.data);
      } catch (error) {
        console.error("Erro ao buscar os machineos:", error);
      }
    };

    fetchMachines();
  }, []);

  return (
    <div>
      <h2>Lista de Maquinas</h2>
      <ul>
        {machines.map((machine) => (
          <li key={machine.id}>
            {machine.machine_name} - Status: {machine.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MachineList;
