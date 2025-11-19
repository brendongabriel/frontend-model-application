import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './MachineDetails.css';
import RankingChart from '../components/RankingCharts';

const BASE_URL = process.env.REACT_APP_URL_BASE;

console.log('BASE_URL:', BASE_URL);

const MachineDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const machineFromList = location.state?.machine || null;

  const [machineDetails, setMachineDetails] = useState(machineFromList);
  const [ranking, setRanking] = useState([]);
  const [metrics, setMetrics] = useState(null); // 👈 NOVO
  const [loadingMachine, setLoadingMachine] = useState(!machineFromList);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [error, setError] = useState(null);

  // modal treino
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [training, setTraining] = useState(false);
  const [trainError, setTrainError] = useState(null);
  const [targetColumn, setTargetColumn] = useState('');

  // toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Detalhes da máquina
  useEffect(() => {
    if (machineFromList) {
      setLoadingMachine(false);
      return;
    }

    const fetchMachine = async () => {
      try {
        const response = await fetch(`${BASE_URL}/machines/${id}`);
        const data = await response.json();
        setMachineDetails(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar detalhes da máquina.');
      } finally {
        setLoadingMachine(false);
      }
    };

    fetchMachine();
  }, [id, machineFromList]);

  // Ranking
  useEffect(() => {
    if (!machineDetails) return;

    const isCompleted =
      (machineDetails.status || '').toString().toLowerCase() === 'completed';

    if (!isCompleted) {
      setLoadingRanking(false);
      setRanking([]);
      setMetrics(null);
      return;
    }

    const fetchRanking = async () => {
      try {
        setLoadingRanking(true);
        const response = await fetch(
          `${BASE_URL}/ranking/?machine_id=${id}`
        );
        const data = await response.json();
        setRanking(data.ranking || []);
        setMetrics(data.metrics || null);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar o ranking da máquina.');
      } finally {
        setLoadingRanking(false);
      }
    };

    fetchRanking();
  }, [id, machineDetails]);

  const totalImportance = ranking.reduce(
    (sum, item) => sum + Number(item.importance || 0),
    0
  );

  const formatPercent = (value) =>
    `${value.toFixed(1).toString().replace('.', ',')}%`;

  const formatNumber = (value, decimals = 3) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return '-';
    }
    return Number(value).toFixed(decimals).toString().replace('.', ',');
  };

  const formatDateTime = (value) => {
    if (!value) return '-';

    let dateObj;

    // timestamp
    if (typeof value === 'number') {
      if (value.toString().length <= 10) {
        dateObj = new Date(value * 1000);
      } else {
        dateObj = new Date(value);
      }
    } else {
      // ISO string
      dateObj = new Date(value);
    }

    if (Number.isNaN(dateObj.getTime())) {
      return '-';
    }

    return dateObj.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const loading = loadingMachine;

  if (loading && !machineDetails) {
    return (
      <div className="machine-page">
        <div className="machine-card">
          <div className="machine-loading">Carregando detalhes da máquina...</div>
        </div>
      </div>
    );
  }

  if (!machineDetails) {
    return (
      <div className="machine-page">
        <div className="machine-card">
          <div className="machine-error">
            <p>{error || 'Não foi possível carregar a máquina.'}</p>
            <Link to="/" className="machine-back-link">
              ← Voltar para lista de máquinas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = (machineDetails.status || '').toString();
  const isCompleted = status.toLowerCase() === 'completed';

  const statusClass = `machine-status-badge machine-status-${status.toLowerCase()}`;

  // Handlers modal treino
  const openTrainModal = () => {
    setTrainError(null);
    setSelectedFile(null);
    setTargetColumn('');
    setIsTrainModalOpen(true);
  };

  const closeTrainModal = () => {
    if (training) return;
    setIsTrainModalOpen(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
    setTrainError(null);
  };

  const handleTrainSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setTrainError('Selecione um arquivo CSV para treino.');
      return;
    }

    if (!targetColumn.trim()) {
      setTrainError('Informe o nome da coluna meta (target_column).');
      return;
    }

    try {
      setTraining(true);
      setTrainError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(
        `${BASE_URL}/train/?machine_id=${id}&target_column=${encodeURIComponent(
          targetColumn.trim()
        )}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao treinar modelo.');
      }

      setIsTrainModalOpen(false);
      showToast(
        'Treinamento enviado com sucesso. O modelo pode levar algum tempo para ser atualizado nos gráficos e rankings.'
      );
    } catch (err) {
      console.error(err);
      setTrainError('Erro ao enviar arquivo para treino.');
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="machine-page">
      <div className="machine-card machine-details-card">
        <div className="machine-details-header">
          <div>
            <h1>{machineDetails.machine_name}</h1>
            <p className="machine-details-subtitle">ID #{machineDetails.id}</p>
          </div>
          <div className="machine-details-header-right">
            <span className={statusClass}>{status}</span>
            <button
              type="button"
              className="machine-train-button"
              onClick={openTrainModal}
            >
              Treinar máquina
            </button>
            <Link to="/" className="machine-back-link">
              ← Voltar
            </Link>
          </div>
        </div>

        
        <div className="machine-details-column">
          <div className="machine-info-block">
            <h3>Informações da máquina</h3>

            <div className="machine-info-row">
              <span className="machine-info-label">Nome:</span>
              <span className="machine-info-value">
                {machineDetails.machine_name}
              </span>
            </div>

            <div className="machine-info-row">
              <span className="machine-info-label">Status:</span>
              <span className="machine-info-value">
                <span className={statusClass}>{status}</span>
              </span>
            </div>
          </div>

          {/* 🔍 Métricas do modelo */}
          {isCompleted && metrics && (
            <div className="machine-metrics-block">
              <h3>Qualidade do modelo</h3>

              {metrics.date && (
                <p className="machine-metrics-date">
                  Treinado em:{' '}
                  <span>{formatDateTime(metrics.date)}</span>
                </p>
              )}

              <div className="machine-metrics-grid">
                <div className="machine-metric-item">
                  <span className="machine-metric-label">R²</span>
                  <span className="machine-metric-value">
                    {formatNumber(metrics.r2, 3)}
                  </span>
                </div>
                <div className="machine-metric-item">
                  <span className="machine-metric-label">MAE</span>
                  <span className="machine-metric-value">
                    {formatNumber(metrics.mae, 3)}
                  </span>
                </div>
                <div className="machine-metric-item">
                  <span className="machine-metric-label">RMSE</span>
                  <span className="machine-metric-value">
                    {formatNumber(metrics.rmse, 3)}
                  </span>
                </div>
                {metrics.n_train !== undefined && (
                  <div className="machine-metric-item">
                    <span className="machine-metric-label">Treino</span>
                    <span className="machine-metric-value">
                      {metrics.n_train}
                    </span>
                  </div>
                )}
                {metrics.n_test !== undefined && (
                  <div className="machine-metric-item">
                    <span className="machine-metric-label">Teste</span>
                    <span className="machine-metric-value">
                      {metrics.n_test}
                    </span>
                  </div>
                )}
                {metrics.n_features !== undefined && (
                  <div className="machine-metric-item">
                    <span className="machine-metric-label">Features</span>
                    <span className="machine-metric-value">
                      {metrics.n_features}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}


          <div className="machine-ranking-block">
            <div className="machine-ranking-header">
              <h3>Impacto das variáveis na produção</h3>
              <span className="machine-count">
                {ranking.length} variável
                {ranking.length !== 1 && 'is'}
              </span>
            </div>

            {/* Se não foi treinado*/}
            {!isCompleted ? (
              <div className="machine-empty machine-empty-train">
                <p>
                  ⚠️ É necessário treinar a máquina antes de visualizar o
                  gráfico e o ranking de variáveis.
                </p>
                <p className="machine-empty-sub">
                  Clique em <strong>"Treinar máquina"</strong> para enviar um
                  arquivo de treino. Após o processamento, os dados serão
                  exibidos aqui.
                </p>
              </div>
            ) : loadingRanking ? (
              <div className="machine-loading">Carregando ranking...</div>
            ) : ranking.length === 0 ? (
              <div className="machine-empty">
                <p>Nenhuma variável de ranking encontrada para esta máquina.</p>
              </div>
            ) : (
              (() => {
                const rowsWithPercent = ranking.map((item, index) => {
                  const value = Number(item.importance || 0);
                  const percent = totalImportance
                    ? (value / totalImportance) * 100
                    : 0;

                  return {
                    ...item,
                    index: index + 1,
                    percent,
                  };
                });

                // TOP 3 variáveis
                const top3 = rowsWithPercent.slice(0, 3);
                const top3PercentSum = top3.reduce(
                  (sum, row) => sum + row.percent,
                  0
                );

                return (
                  <>
                    <RankingChart ranking={ranking} />
                    <div className="machine-insights-block">
                      <span className="machine-insights-title">Insight rápido</span>
                      <p className="machine-insights-text">
                        As <strong>3 variáveis mais importantes</strong> somadas
                        representam{' '}
                        <strong>{formatPercent(top3PercentSum)}</strong> do impacto
                        total estimado pelo modelo para esta máquina.
                      </p>
                    </div>

                    <div className="machine-table-wrapper" style={{ marginTop: 10 }}>
                      <table className="machine-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Variável</th>
                            <th>Importância (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowsWithPercent.map((row) => (
                            <tr key={row.index}>
                              <td>{row.index}</td>
                              <td>{row.feature}</td>
                              <td>
                                {totalImportance
                                  ? formatPercent(row.percent)
                                  : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()
            )}
          </div>
        </div>
      </div>

      {isTrainModalOpen && (
        <div className="machine-modal-backdrop" onClick={closeTrainModal}>
          <div
            className="machine-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Treinar máquina</h2>
            <p className="machine-modal-subtitle">
              Envie um arquivo <strong>.csv</strong> com os dados para treino do
              modelo desta máquina.
            </p>

            <form onSubmit={handleTrainSubmit} className="machine-modal-form">
              <div className="machine-modal-field">
                <label htmlFor="target-column">Coluna meta (target_column)</label>
                <input
                  id="target-column"
                  type="text"
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  placeholder='Ex: "target", "y", "falha", etc.'
                  disabled={training}
                />
              </div>

              <div className="machine-modal-field">
                <label>Arquivo CSV</label>

                <label
                  className={`machine-file-input ${training ? 'disabled' : ''}`}
                  htmlFor="csv-file"
                >
                  <div className="machine-file-input-text">
                    {selectedFile
                      ? selectedFile.name
                      : 'Clique para selecionar o arquivo CSV'}
                    <span className="machine-file-input-hint">
                      Formato aceito: .csv
                    </span>
                  </div>
                  <div className="machine-file-input-button">
                    Escolher arquivo
                  </div>
                  <input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={training}
                  />
                </label>
              </div>

              {trainError && (
                <div className="machine-modal-message machine-modal-error">
                  {trainError}
                </div>
              )}

              <div className="machine-modal-actions">
                <button
                  type="button"
                  className="machine-modal-button secondary"
                  onClick={closeTrainModal}
                  disabled={training}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="machine-modal-button primary"
                  disabled={training}
                >
                  {training ? 'Treinando...' : 'Iniciar treino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && <div className="machine-toast">{toastMessage}</div>}
    </div>
  );
};

export default MachineDetails;
