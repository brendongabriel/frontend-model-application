# 📌 Frontend – Interface Web para Visualização e Interpretação do Modelo

1. [Repositório do modelo da aplicação;](https://github.com/brendongabriel/relevance-service)
2. [Repositório do backend da aplicação;](https://github.com/brendongabriel/backend-model-application)

Este repositório contém o **frontend da plataforma**, desenvolvido em **React**, responsável por exibir dashboards interativos, rankings de variáveis, gráficos explicativos e uma interface para envio de arquivos CSV para treinamento dos modelos de relevância.

A aplicação traduz os resultados do modelo — que analisa dezenas de variáveis operacionais — em **insights visuais e acionáveis**, permitindo que operadores, analistas e gestores entendam rapidamente o que mais influencia a produção.

---

## 📊 Sobre os Dashboards da Plataforma

Os dashboards foram projetados para transformar os resultados técnicos do modelo (como SHAP values, importâncias nativas e métricas de regressão) em **visualizações fáceis de entender**, mesmo por usuários sem conhecimento em Machine Learning.

Assim que um modelo é treinado e salvo, o frontend consome as APIs do backend para exibir:

---

### 🔹 Ranking de Impacto das Variáveis

O dashboard destaca as variáveis que mais influenciam o desempenho da máquina, exibindo:

- **Gráfico de barras horizontal (Top 10)**  
- **Importância percentual normalizada**
- **Posição no ranking**
- **Direção do impacto (Insights SHAP)**
  - *Aumentar a variável tende a aumentar a produção*, ou  
  - *Aumentar a variável tende a reduzir o resultado*, ou  
  - *A relação é não linear*

Além disso, a tabela completa inclui todos os atributos relevantes (acima de 1% de importância), permitindo uma análise detalhada e precisa dos fatores que realmente impactam o processo produtivo.

Essa visualização facilita decisões como:
- detecção de gargalos,
- otimização de parâmetros operacionais,
- priorização de variáveis críticas.

---

### 🔹 Indicadores de Qualidade do Modelo

Para validar se a análise gerada é confiável, o dashboard exibe:

- **R² (coeficiente de determinação)**
- **MAE (Erro Absoluto Médio)**
- **RMSE (Raiz do Erro Quadrático Médio)**
- **Quantidade de dados de treino e teste**
- **Número total de variáveis usadas no modelo**

Essas métricas permitem que o usuário interprete os insights tendo como base a performance real do modelo.

---

### 🔹 Experiência de Uso Clara e Responsiva

A interface foi construída com foco na simplicidade:

- Navegação intuitiva  
- Layout responsivo  
- Organização clara das seções  
- Datas, percentuais e métricas formatados automaticamente

Tudo isso permite que a plataforma seja utilizada tanto em computadores quanto em tablets ou celulares.

---

### 🔹 Integração Completa com Backend e Modelo

O frontend se comunica diretamente com o backend, que por sua vez acessa o modelo treinado no serviço de Machine Learning.  
Essa arquitetura garante:

- **dados sempre atualizados após cada novo treinamento**,  
- **insights consistentes e sincronizados**,  
- **visualizações que refletem exatamente o que o modelo aprendeu**.

---

## 🚀 Tecnologias Utilizadas

- **React + Vite**
- **Recharts** (visualização de gráficos)
- **Fetch API** (requests HTTP)
- **React Hooks / Context API**
- **CSS modularizado**

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