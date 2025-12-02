import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MachineTable.css';
import { deleteMachine } from '../api/api';
import { FiRefreshCw } from "react-icons/fi";

const MachineTable = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal de cadastro
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMachineName, setNewMachineName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/machines/');
        const data = await response.json();
        setMachines(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao buscar máquinas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  const openCreateModal = () => {
    setCreateError(null);
    setNewMachineName('');
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (creating) return;
    setIsCreateModalOpen(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!newMachineName.trim()) {
      setCreateError('Informe o nome da máquina.');
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      const response = await fetch('http://127.0.0.1:8001/machines/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machine_name: newMachineName.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar máquina.');
      }

      const createdMachine = await response.json();

      setMachines((prev) => [...prev, createdMachine]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      setCreateError('Erro ao cadastrar máquina.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMachine(id);
      setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert("Erro ao deletar máquina.");
      console.error(e);
    }
  };


  return (
    <div className="machine-page">
      <div className="machine-card">
        <div className="machine-card-header">
          <h1>Tabela de Máquinas</h1>
          <div className="machine-card-header-right">
            <button className="machine-add-button machine-reload-button" type="button" onClick={handleReload}>
              <FiRefreshCw size={18} />
            </button>

            <span className="machine-count">
              {machines.length} máquina{machines.length !== 1 && 's'}
            </span>

            <button
              type="button"
              className="machine-add-button"
              onClick={openCreateModal}
            >
              Cadastrar máquina
            </button>
          </div>
        </div>

        {loading ? (
          <div className="machine-loading">Carregando máquinas...</div>
        ) : error ? (
          <div className="machine-error">{error}</div>
        ) : machines.length === 0 ? (
          <div className="machine-empty">
            <p>Nenhuma máquina cadastrada ainda.</p>
          </div>
        ) : (
          <div className="machine-table-wrapper">
            <table className="machine-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome da Máquina</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <tr key={machine.id}>
                    <td>{machine.id}</td>
                    <td>
                      <Link
                        className="machine-link"
                        to={`/machine/${machine.id}`}
                        state={{ machine }}
                      >
                        {machine.machine_name}
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`
                          machine-status-badge
                          machine-status-${(machine.status || 'desconhecido')
                            .toString()
                            .toLowerCase()}
                        `}
                      >
                        {machine.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(machine.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* modal cadastro */}
      {isCreateModalOpen && (
        <div className="machine-modal-backdrop" onClick={closeCreateModal}>
          <div
            className="machine-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Cadastrar máquina</h2>
            <p className="machine-modal-subtitle">
              Preencha o nome para cadastrar uma nova máquina.
            </p>

            <form onSubmit={handleCreateSubmit} className="machine-modal-form">
              <div className="machine-modal-field">
                <label htmlFor="machine-name">Nome da máquina</label>
                <input
                  id="machine-name"
                  type="text"
                  value={newMachineName}
                  onChange={(e) => setNewMachineName(e.target.value)}
                  placeholder="Ex: Prensa 01, Linha A - Motor 3"
                  disabled={creating}
                />
              </div>

              {createError && (
                <div className="machine-modal-message machine-modal-error">
                  {createError}
                </div>
              )}

              <div className="machine-modal-actions">
                <button
                  type="button"
                  className="machine-modal-button secondary"
                  onClick={closeCreateModal}
                  disabled={creating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="machine-modal-button primary"
                  disabled={creating}
                >
                  {creating ? 'Salvando...' : 'Salvar máquina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineTable;
