import React from "react";
import './InsightCards.css';

const InsightCards = ({ ranking }) => {
  if (!ranking || ranking.length === 0) return null;

  // Top 3 variáveis
  const top3 = ranking.slice(0, 3);

  return (
    <div className="insight-cards-wrapper">
      <h3 className="insight-section-title">Por que essas variáveis são importantes?</h3>

      <div className="insight-cards-grid">
        {top3.map((item, index) => (
          <div key={index} className="insight-card">
            <h4 className="insight-card-title">
              #{index + 1} — {item.feature}
            </h4>

            <p className="insight-card-text">
              Esta variável apresenta um impacto significativo no modelo, com
              <strong> impacto SHAP médio de {item.importance_shap_mean_abs.toFixed(2)}</strong>
              {item.importance_native > 0 && (
                <>
                  {" "}e uma <strong>importância estrutural de {(item.importance_native * 100).toFixed(2)}%</strong>.
                </>
              )}
            </p>

            {item.shap_norm > 0.7 && item.native_norm < 0.3 && (
              <p className="insight-card-extra">
                🔍 Apesar do baixo peso estrutural, ela influencia fortemente as previsões — comportamento não linear importante.
              </p>
            )}

            {item.shap_norm > 0.7 && item.native_norm > 0.7 && (
              <p className="insight-card-extra">
                ⭐ Variável essencial: alta relevância estrutural e alto impacto prático.
              </p>
            )}

            {item.native_norm > 0.6 && item.shap_norm < 0.3 && (
              <p className="insight-card-extra">
                📌 Variável estrutural — o modelo depende dela para formar a estrutura das árvores.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightCards;
