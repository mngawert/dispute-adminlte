import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import DisputeData from "./components/DisputeData";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Test from "./pages/Test";
import PrivateRoute from "./components/PrivateRoute";
import Dispute from "./pages/Dispute";

function App() {
  return (
    <Router>
      <div className="wrapper">
        {/* Navbar */}

        <Navbar />

        {/* Sidebar */}
        <Sidebar />

        {/* Content Wrapper */}
        <div className="content-wrapper">
          <section className="content">
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dispute" element={<Dispute />} />
                <Route path="/test" element={<Test />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
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
