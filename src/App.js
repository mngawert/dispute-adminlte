import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import DisputeData from "./components/DisputeData";

function App() {
  return (
    <Router>
      <div className="wrapper">
        {/* Navbar */}

        <Navbar />

        {/* Sidebar */}

        {/* Content Wrapper */}
        <div className="content-wrapper">
          <section className="content">
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/disputedata" element={<DisputeData />} />
              </Routes>
            </div>
          </section>
        </div>

        {/* Footer */}

        <Footer />
      </div>
    </Router>
  );
}

export default App;
