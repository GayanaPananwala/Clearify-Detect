import React from "react";
import { Typography, CircularProgress } from "@mui/material";

//This function is for rendering prediction results
export function PredictionResults({
  prediction,
  aiGeneratedPercentage,
  humanGeneratedPercentage,
}) {
  return (
    <div id="prediction-result-container" className="col">
      <h3>Prediction Results:</h3>
      <div className="circular-progress-container">
        <CircularProgress
          variant="determinate"
          value={aiGeneratedPercentage}
          size={245}
          thickness={5}
          style={{
            color: "rgb(183, 14, 14)",
            position: "absolute",
            left: 170,
            transform: "rotate(180deg)",
          }}
        />
        <CircularProgress
          variant="determinate"
          value={humanGeneratedPercentage}
          size={245}
          thickness={5}
          style={{
            color: "green",
            position: "absolute",
            left: 170,
            transform: "rotate(180deg) scaleX(1) scaleY(-1)",
          }}
        />
        <Typography
          variant="body2"
          className="ai-detection-score"
          style={{
            position: "absolute",
            top: 145,
            left: 296,
            transform: "translate(-50%, -50%)",
            fontSize: "18px",
            fontFamily: "Aleo",
          }}
        >
          AI Detection Score
        </Typography>
      </div>

      <div style={{ marginTop: 270 }}>
        <span className="decision-text">{prediction}</span>
        <br />
        <div className="percentages">
          <span>AI: {aiGeneratedPercentage}% </span>
          <span>Original: {humanGeneratedPercentage}%</span>
        </div>
      </div>
    </div>
  );
}
