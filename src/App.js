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
import DisputeBak from "./pages/DisputeBak";
import MainLayout from './MainLayout';
import AuthLayout from './AuthLayout';
import Review from "./pages/Review";
import ReviewBak from "./pages/ReviewBak";
import AdjustPlus from "./pages/AdjustPlus";
import AdjustMinus from "./pages/AdjustMinus";
import AdjustP31 from "./pages/AdjustP31";
import AdjustP32 from "./pages/AdjustP32";
import { DocumentProvider } from "./contexts/DocumentContext";

function App() {
  return (

    <DocumentProvider>
      <Router>
        <Routes>
          <Route element={ <AuthLayout /> }>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={ <MainLayout /> }>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dispute" element={<Dispute />} />
            <Route path="/disputeBak" element={<DisputeBak />} />
            <Route path="/create" element={<Review reviewType="Create" prevDocumentStatus='Create-Pending' />} />
            <Route path="/review" element={<Review reviewType="Review" prevDocumentStatus='Create-Accept' />} />
            <Route path="/approve" element={<Review reviewType="Approve" prevDocumentStatus='Review-Accept' />} />
            <Route path="/finance" element={<Review reviewType="Finance" prevDocumentStatus='Approve-Accept' />} />
            <Route path="/reviewBak" element={<ReviewBak />} />
            <Route path="/adjustPlus" element={<AdjustPlus />} />
            <Route path="/adjustMinus" element={<AdjustMinus />} />
            <Route path="/adjustP31" element={<AdjustP31 />} />
            <Route path="/adjustP32" element={<AdjustP32 />} />

            <Route path="/test" element={<Test />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/disputedata" element={<DisputeData />} />
          </Route>
        </Routes>
      </Router>
    </DocumentProvider>
  );
}

export default App;
