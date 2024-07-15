import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";

//This function is for rendering explanation component
function Explanation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  // UseState variables to manage explanation and loading state
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect hook is used to fetch explanation when text changes
  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const response = await fetch("http://localhost:5000/explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: state.text }),
        });
        if (!response.ok) {
          throw new Error("Failed to get explanation.");
        }
        const data = await response.json();
        setExplanation(data);
      } catch (error) {
        console.error("Error fetching explanation:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching is done
      }
    };

    fetchExplanation();
  }, [state.text]);

  // Function to handle click event to handle prediction click
  const handlePredictionClick = () => {
    navigate("/tab-view/prediction", {
      state: {
        text: state.text,
        prediction: state.prediction,
        aiGeneratedPercentage: state.aiGeneratedPercentage,
        humanGeneratedPercentage: state.humanGeneratedPercentage,
        clickedExplaination: state.clickedExplaination,
      },
    });
  };
  // Function to handle click event to start over
  const handleStartOverClick = () => {
    navigate("/tab-view/prediction", { state: null }); // Empty the location state
  };

  // Function to render text with highlighted colors
  const renderTextWithColors = () => {
    if (!state.text || !explanation || !explanation.highlighted_text)
      return null;

    const words = state.text.split(" ");

    return words.map((word, index) => {
      const wordData = explanation.highlighted_text.find(
        (data) => data.word === word
      );
      const color = wordData ? wordData.color : "black";
      return (
        <span key={index} style={{ color }}>
          {word}{" "}
        </span>
      );
    });
  };
  // Function to render points to remember
  const renderPointsToRemember = () => {
    return (
      <div className="explain-points">
        <ul>
          <li>
            The colored highlighting in the text serves as a visual
            representation of the importance of words or phrases in contributing
            to the prediction.
          </li>
          <li>
            Words contributing to the prediction of AI-generated content are
            highlighted in{" "}
            <span style={{ backgroundColor: "red", color: "white" }}>red</span>.
          </li>
          <li>
            Words contributing to the prediction of Human-written content are
            highlighted in{" "}
            <span style={{ backgroundColor: "green", color: "white" }}>
              green
            </span>
            .
          </li>
        </ul>
      </div>
    );
  };
  // Render the Explanation component
  return (
    <Box className="explanation-container" sx={{ p: 2 }}>
      {loading && ( // Show loader if loading is true
        <div>
          <span className="loading-text">
            Hey there, Analyzing your text now, hang tight!
          </span>
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      )}
      <Typography variant="body1" gutterBottom>
        {renderTextWithColors()}
        {renderPointsToRemember()}
      </Typography>

      <button className="backBtn" onClick={handlePredictionClick}>
        Go back to prediction infos
      </button>
      <button id="startOver" className="backBtn" onClick={handleStartOverClick}>
        Start Over
      </button>
    </Box>
  );
}
// Export the Explanation component
export default Explanation;
