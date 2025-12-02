import axios from "axios";

const BASE_URL = process.env.REACT_APP_URL_BASE;

// Função para criar um novo maquina
export const createMachine = async (machineName) => {
  try {
    const response = await axios.post(`${BASE_URL}/models/`, { machine_name: machineName });
    return response.data;
  } catch (error) {
    console.error("Error creating model:", error);
    throw error;
  }
};

// Função para buscar o ranking das variáveis de um maquina
export const getModelRanking = async (machine_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/ranking?machine_id=${machine_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching model ranking:", error);
    throw error;
  }
};


export async function deleteMachine(id) {
  const response = await axios.delete(`${BASE_URL}/machines/${id}`);
  if (response.status !== 200) {
    throw new Error("Erro ao deletar máquina");
  }

  return true;
}

