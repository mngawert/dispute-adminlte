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
import AdjustP35 from "./pages/AdjustP35";
import AdjustP36 from "./pages/AdjustP36";
import AdjustP3Plus from "./pages/AdjustP3Plus";
import AdjustP3Minus from "./pages/AdjustP3Minus";
import AdjustB from "./pages/AdjustB";

import { DocumentProvider } from "./contexts/DocumentContext";
import SearchAdj from "./pages/SearchAdj";
import User from "./pages/User";
import NotAuthorized from "./pages/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <Route path="/Create" element={ <PrivateRoute element={<Review reviewType="Create" prevDocumentStatus='Create-Pending' />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/Review" element={ <PrivateRoute element={<Review reviewType="Review" prevDocumentStatus='Create-Accept' />} allowedRoles={['Admin', 'Reviewer']} /> } />
            <Route path="/Approve" element={ <PrivateRoute element={<Review reviewType="Approve" prevDocumentStatus='Review-Accept' />} allowedRoles={['Admin', 'Approver']} /> } />
            <Route path="/Finance" element={ <PrivateRoute element={<Review reviewType="Finance" prevDocumentStatus='Approve-Accept' />} allowedRoles={['Admin', 'Finance']} /> } />
            <Route path="/reviewBak" element={<ReviewBak />} />
            <Route path="/AdjustPlus" element={ <PrivateRoute element={<AdjustPlus />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustMinus" element={ <PrivateRoute element={<AdjustMinus />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustP31" element={ <PrivateRoute element={<AdjustP31 />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustP31" element={ <PrivateRoute element={<AdjustP31 />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustP32" element={ <PrivateRoute element={<AdjustP32 />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustP35" element={ <PrivateRoute element={<AdjustP35 />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustP36" element={ <PrivateRoute element={<AdjustP36 />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustP3Plus" element={ <PrivateRoute element={<AdjustP3Plus />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustP3Minus" element={ <PrivateRoute element={<AdjustP3Minus />} allowedRoles={['Admin', 'Creator']} /> } />
            <Route path="/AdjustB" element={<AdjustB />} />
            <Route path="/SearchAdj" element={<SearchAdj />} />
            <Route path="/User" element={<User />} />
            <Route path="/not-authorized" element={<NotAuthorized /> } />

            <Route path="/test" element={<Test />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} allowedRoles={['Admin']} />} />
            <Route path="/disputedata" element={<DisputeData />} />
          </Route>
        </Routes>
      </Router>
    </DocumentProvider>
  );
}

export default App;
