import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/HomePage/Home";
import TabViewPage from "./Components/TabView/TabViewPage";
import Header from "./Components/Layout/Header";
import Footer from "./Components/Layout/Footer";

// Define the App component
export default function App() {
  // Render the App component
  return (
    <div className="container">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tab-view/*" element={<TabViewPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
