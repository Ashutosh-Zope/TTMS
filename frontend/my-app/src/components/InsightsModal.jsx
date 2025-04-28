import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5001/api";

const InsightsModal = ({ ticket, onClose }) => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`${API_BASE}/ai-insights`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: ticket.title,
            description: ticket.description,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setInsights(data.insights || "No suggestions available.");
      } catch (error) {
        console.error("Error fetching AI insights:", error.message);
        setInsights(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [ticket]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="insights-modal" onClick={(e) => e.stopPropagation()}>
        <button className="insights-close-btn" onClick={onClose}>×</button>

        <h2 className="insights-title">
          AI Insights for <span className="ticket-title">"{ticket.title}"</span>
        </h2>

        <div className="insights-card">
          {loading ? (
            <p className="loading-text">Loading AI suggestions...</p>
          ) : (
            <div className="insights-text">
              {insights.split("\n").map((line, idx) => {
                if (line.startsWith("Better Title")) {
                  return <p key={idx}><strong>{line}</strong></p>;
                }
                if (line.startsWith("Better Description")) {
                  return <p key={idx} style={{ marginTop: "1rem" }}><strong>{line}</strong></p>;
                }
                if (line.startsWith("Action Suggestions")) {
                  return <p key={idx} style={{ marginTop: "1.5rem" }}><strong>{line}</strong></p>;
                }
                return <p key={idx} style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>{line}</p>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsModal;
