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
import MainLayout from './MainLayout';
import AuthLayout from './AuthLayout';

function App() {
  return (

    <Router>
      <Routes>
        <Route element={ <AuthLayout /> }>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={ <MainLayout /> }>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dispute" element={<Dispute />} />
          <Route path="/test" element={<Test />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/disputedata" element={<DisputeData />} />
        </Route>
      </Routes>
    </Router>



  );
}

export default App;
