import React, { useState, useEffect } from "react";
import { TextareaAutosize, Typography } from "@mui/material";
import { PredictionResults } from "./predictionResult";
import _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";

//This function is for rendering prediction form component
function PredictionForm() {
  // React hooks to manage component state
  const location = useLocation();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showExplanationButton, setShowExplanationButton] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [prediction, setPrediction] = useState("");
  const [aiGeneratedPercentage, setAIGeneratedPercentage] = useState(0);
  const [humanGeneratedPercentage, setHumanGeneratedPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  // useEffect hook to handle location state changes
  useEffect(() => {
    if (location.state) {
      // Extracting data from location state and setting component state
      const {
        text,
        prediction,
        aiGeneratedPercentage,
        humanGeneratedPercentage,
      } = location.state;
      setText(text);
      setPrediction(prediction);
      setAIGeneratedPercentage(aiGeneratedPercentage);
      setHumanGeneratedPercentage(humanGeneratedPercentage);
      setShowResults(true);
      setShowExplanationButton(true);
      // Counting words in the text
      const count = _.words(text).length;
      setWordCount(count);

      // Emptying the location state
      navigate("/tab-view/prediction", { state: null });
    }
  }, [location.state, navigate]);

  // Function to handle scan button click
  const handleScanClick = () => {
    if (showResults) {
      // Reload the page without retaining any state
      window.location.reload();
    } else {
      //Check if the text contains is empty
      if (text.trim() === "") {
        alert("Text input is empty. Please provide a text to scan!");
        return;
      }
      //Check if the text length is smaller than 250
      if (text.trim().length < 250) {
        alert(
          "The text length is too small. Please provide a text with at least 260 characters."
        );
        return;
      }
      // Checks if the text contains only numbers, only special characters,
      // or a combination of both
      if (isNumericOrSpecial(text.trim())) {
        alert("Please enter a valid input");
        return;
      }
    }

    if (!showResults) {
      setLoading(true);
      setTimeout(() => {
        makePrediction();
        setShowResults(true);
        setShowExplanationButton(true);
      }, 2000);
    }
  };
  // Function to check if the text contains only numbers, only special characters, or a combination of both
  const isNumericOrSpecial = (input) => {
    return (
      /^\d+$/.test(input) ||
      /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+$/.test(input) ||
      /^\d+(\s\d+)*$/.test(input)
    );
  };
  // Function to handle explanation button click
  const handleExplanationClick = () => {
    navigate("/tab-view/explanation", {
      state: {
        text,
        prediction,
        aiGeneratedPercentage,
        humanGeneratedPercentage,
      },
    });
  };

  // Function to handle text input change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // Counting words in the new text
    const count = _.words(newText).length;
    setWordCount(count);
  };

  // Function to make prediction
  const makePrediction = async () => {
    try {
      const response = await fetch("http://localhost:8080/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("Failed to get prediction.");
      }
      const data = await response.json();
      // Updating prediction and percentages
      setPrediction(data.prediction);
      setAIGeneratedPercentage(data.ai_generated_percentage);
      setHumanGeneratedPercentage(data.human_generated_percentage);
      setLoading(false);
    } catch (error) {
      console.error("Error making prediction:", error);
      setLoading(false);
    }
  };

  // Rendering the component
  return (
    <div className="prediction-form-container">
      <div className="col">
        <TextareaAutosize
          className="input-text"
          placeholder="Paste your content here..."
          value={text}
          onChange={handleTextChange}
          rowsMin={5}
          style={{
            width: "100%",
            marginBottom: "10px",
            height: 300,
            resize: "vertical",
            overflow: "auto",
            backgroundColor: "aliceblue",
          }}
        />
        <Typography variant="body2" gutterBottom>
          Words: {wordCount}
        </Typography>
        {/* Scan button */}
        <button className="scanBtn" onClick={handleScanClick}>
          {showResults ? "Re-scan Me" : "Scan Me"}
        </button>
        {/* Explanation button */}
        {showExplanationButton && (
          <button className="explainBtn" onClick={handleExplanationClick}>
            View Explanations
          </button>
        )}{" "}
        {/* Loading spinner */}
        {loading && (
          <div className="loading-content">
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
      </div>

      {/* Displaying prediction results */}
      {showResults && prediction && (
        <PredictionResults
          prediction={prediction}
          aiGeneratedPercentage={aiGeneratedPercentage}
          humanGeneratedPercentage={humanGeneratedPercentage}
        />
      )}
    </div>
  );
}

export default PredictionForm;
