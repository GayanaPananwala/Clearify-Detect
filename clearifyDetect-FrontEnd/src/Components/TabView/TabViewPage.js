import React from "react";
import { Tab, Tabs, Box } from "@mui/material";
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Import components for prediction and explanation tabs
import PredictionForm from "./PredictionTab/predictionForm";
import ExplanationTab from "./ExplanationTab/Explanation";
// Import CSS styles for the tab view page
import "../../styles/tabviewpage.css";

//This function is for rendering TabViewPage component
function TabViewPage() {
  const navigate = useNavigate();
  const location = useLocation(); //Hook to get the current location
  // Determine the current tab based on the location pathname
  const currentTab = location.pathname.split("/")[2] || "prediction";

  // Render the TabViewPage component
  return (
    <div className="tabview-container">
      <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          centered
          sx={{
            ".Mui-selected": {
              color: "#ffffff !important",
            },
            ".MuiTab-root": {
              "&:hover": {
                cursor: "default",
              },
            },
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#fff",
              height: "8px",
            },
          }}
        >
          <Tab
            label="Prediction"
            value="prediction"
            sx={{
              color: "red",
              fontFamily: "Aleo",
            }}
          />
          <Tab
            label="Explanation"
            value="explanation"
            sx={{ color: "red", fontFamily: "Aleo" }}
          />
        </Tabs>
      </Box>
      <div className="tab-content">
        <Routes>
          <Route path="/" element={<Outlet />} />
          <Route path="/prediction" element={<PredictionForm />} />
          <Route path="/explanation" element={<ExplanationTab />} />
        </Routes>
      </div>
    </div>
  );
}
// Export the TabViewPage component
export default TabViewPage;
