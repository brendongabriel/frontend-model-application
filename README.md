# 📌 Frontend – Interface Web para Visualização e Treinamento de Modelos

Este repositório contém o **frontend** da aplicação, desenvolvido em **React**, responsável por exibir dashboards, tabelas, rankings de variáveis, gráficos e permitir o envio de arquivos CSV para treinamento de modelos.

---

## 📊 Sobre os Dashboards da Plataforma

A interface do frontend foi desenvolvida para transformar o resultado do modelo de relevância em **insights visuais e facilmente interpretáveis**. Como o modelo analisa dezenas de variáveis operacionais e produz métricas complexas, os dashboards têm o papel de traduzir essas informações em gráficos claros, rankings e indicadores que ajudem técnicos, analistas e gestores a tomar decisões rápidas.

Assim que um modelo é treinado, o frontend consome as APIs do backend e exibe:

### 🔹 Ranking de Impacto das Variáveis
O dashboard apresenta as variáveis que mais influenciam o resultado da produção ou desempenho da máquina.  
As variáveis são exibidas em um **gráfico de barras horizontal (Top 10)**, permitindo identificar rapidamente os fatores de maior relevância.

Para cada variável, o dashboard mostra:
- **Importância percentual normalizada**
- **Posição no ranking**
- **Direção do impacto**  
  (se aumentar a variável tende a aumentar ou reduzir o resultado previsto)

Esse ranking visual auxilia na detecção de gargalos, otimização do processo e entendimento dos fatores mais críticos da operação.

### 🔹 Indicadores de Qualidade do Modelo
O dashboard também exibe métricas fundamentais para avaliar o desempenho do modelo, como:

- **R²**
- **MAE**
- **RMSE**
- **Quantidade de dados de treino e teste**
- **Número de features consideradas**

Essas métricas garantem que o usuário interprete os resultados com base na confiabilidade do modelo gerado.

### 🔹 Interface Clara e Responsiva
Toda a interface foi construída com foco na **simplicidade e clareza**, permitindo que operadores, analistas e gestores utilizem os dashboards confortavelmente tanto no computador quanto em dispositivos móveis.

### 🔹 Integração Completa com Backend e Modelo
Os dashboards recebem os dados diretamente das APIs do backend, que por sua vez consultam o modelo treinado.  
Isso garante que as visualizações estejam sempre atualizadas após cada novo treinamento, entregando **insights em tempo real** sobre o comportamento da máquina.

---

## 🚀 Tecnologias Utilizadas
- React + Vite
- Recharts (gráficos)
- Fetch API (requisições HTTP)
- Context API / Hooks
- CSS modularizado

---

## 📦 Estrutura do Projeto
```
frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   └── api/
 ├── public/
 └── package.json
```

## 🖥️ Telas Principais
- **Lista de Máquinas**
- **Detalhes da Máquina**
- **Ranking de Variáveis**
- **Envio de Arquivo CSV p/ Treinamento**
- **Dashboard com gráficos**

---

## ⚙️ Como Rodar o Projeto
```bash
npm install
npm run dev
```

---

## 🧩 Variáveis de Ambiente
Crie um arquivo `.env` com:

```
VITE_API_BASE_URL=http://localhost:8001
```

---

## 📄 Licença
MIT
