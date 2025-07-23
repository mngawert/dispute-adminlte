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
import AdjustP3Plus_Bak from "./pages/AdjustP3Plus_Bak";
import AdjustP3Minus_Bak from "./pages/AdjustP3Minus_Bak";
import AdjustP3Plus from "./pages/AdjustP3Plus";
import AdjustP3Minus from "./pages/AdjustP3Minus";
import AdjustB from "./pages/AdjustB";
import AdjustB_Bak from "./pages/AdjustB_Bak";
import User from "./pages/User";
import Group from "./pages/Group";

import { DocumentProvider } from "./contexts/DocumentContext";
import SearchAdj from "./pages/SearchAdj";
import UserBak from "./pages/UserBak";
import NotAuthorized from "./pages/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from './pages/ChangePassword'; 
import ReportA from "./pages/ReportA"; 
import ReportB from "./pages/ReportB"; 
import ReportP from "./pages/ReportP"; 
import ReportUser from "./pages/ReportUser"; 

function App() {
  return (
    <DocumentProvider>
      <Router basename="/NTAdjustor"> {/* Set the basename here */}
        <Routes>
          <Route element={ <AuthLayout /> }>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={ <MainLayout /> }>
            <Route path="/" element={<PrivateRoute element={<Home />} allowedRoles={['*']} />} />
            <Route path="/Home" element={<PrivateRoute element={<Home />} allowedRoles={['*']} />} />
            {/* <Route path="/dispute" element={<Dispute />} /> */}
            {/* <Route path="/disputeBak" element={<DisputeBak />} /> */}
            {/* <Route path="/Create" element={ <PrivateRoute element={<Review reviewType="Create" prevDocumentStatus='Create-Pending' />} allowedRoles={['Admin', 'Creator']} /> } /> */}
            <Route path="/Review" element={ <PrivateRoute element={<Review reviewType="Review" prevDocumentStatus='Create-Accept' />} allowedRoles={['Admin', 'Reviewer']} /> } />
            <Route path="/Approve" element={ <PrivateRoute element={<Review reviewType="Approve" prevDocumentStatus='Review-Accept' />} allowedRoles={['Admin', 'Approver']} /> } />
            <Route path="/Finance" element={ <PrivateRoute element={<Review reviewType="Finance" prevDocumentStatus='Approve-Accept' />} allowedRoles={['Admin', 'Finance']} /> } />
            <Route path="/Cancel" element={ <PrivateRoute element={<Review reviewType="Cancel" prevDocumentStatus='CREATED_IN_RBM' />} allowedRoles={['Admin', 'Finance']} /> } />
            <Route path="/Retry" element={ <PrivateRoute element={<Review reviewType="Retry" prevDocumentStatus='ERROR_IN_RBM,PARTIAL_ERROR' />} allowedRoles={['Admin', 'Approver', 'Finance']} /> } />
            {/* <Route path="/reviewBak" element={<ReviewBak />} /> */}
            <Route path="/AdjustPlus" element={ <PrivateRoute element={<AdjustPlus />} allowedRoles={['Admin', 'Creator', 'Creator_Adjust+']} /> } />
            <Route path="/AdjustMinus" element={ <PrivateRoute element={<AdjustMinus />} allowedRoles={['Admin', 'Creator', 'Creator_Adjust-']} /> } />
            <Route path="/AdjustP31" element={ <PrivateRoute element={<AdjustP31 />} allowedRoles={['Admin', 'Creator', 'Creator_P31']} /> } />
            <Route path="/AdjustP32" element={ <PrivateRoute element={<AdjustP32 />} allowedRoles={['Admin', 'Creator', 'Creator_P32']} /> } />
            <Route path="/AdjustP35" element={ <PrivateRoute element={<AdjustP35 />} allowedRoles={['Admin', 'Creator', 'Creator_P35']} /> } />
            <Route path="/AdjustP36" element={ <PrivateRoute element={<AdjustP36 />} allowedRoles={['Admin', 'Creator', 'Creator_P36']} /> } />
            <Route path="/AdjustP3Plus" element={ <PrivateRoute element={<AdjustP3Plus />} allowedRoles={['Admin', 'Creator', 'Creator_P3+']} /> } />
            <Route path="/AdjustP3Minus" element={ <PrivateRoute element={<AdjustP3Minus />} allowedRoles={['Admin', 'Creator', 'Creator_P3-']} /> } />
            {/* <Route path="/AdjustP3Plus_Bak" element={ <PrivateRoute element={<AdjustP3Plus_Bak />} allowedRoles={['Admin', 'Creator', 'Creator_P3+']} /> } /> */}
            {/* <Route path="/AdjustP3Minus_Bak" element={ <PrivateRoute element={<AdjustP3Minus_Bak />} allowedRoles={['Admin', 'Creator', 'Creator_P3-']} /> } /> */}
            {/* <Route path="/AdjustB_Bak" element={<AdjustB_Bak />} /> */}
            <Route path="/AdjustB" element={ <PrivateRoute element={<AdjustB />} allowedRoles={['Admin', 'Creator', 'Creator_B1+/-']} /> } />
            <Route path="/MyAdj" element={ <PrivateRoute element={<SearchAdj myAdjust="Yes" title="My Adjustments" fetchDataAtStart="Yes" />} allowedRoles={['*']} /> } />
            <Route path="/SearchAdj" element={ <PrivateRoute element={<SearchAdj myAdjust="No" title="Search Adjustments" fetchDataAtStart="No" />} allowedRoles={['*']} /> } />
            {/* <Route path="/MyAdj2" element={<SearchAdj myAdjust="Yes" title="My Adjustments" fetchDataAtStart="Yes" />} /> */}
            {/* <Route path="/SearchAdj2" element={<SearchAdj myAdjust="No" title="Search Adjustments" fetchDataAtStart="No" />} /> */}
            {/* <Route path="/UserBak" element={<UserBak />} /> */}
            <Route path="/Not-authorized" element={<PrivateRoute element={<NotAuthorized />} allowedRoles={['*']} />} />
            {/* <Route path="/not-authorized2" element={<NotAuthorized /> } /> */}
            <Route path="/User" element={<PrivateRoute element={<User />} allowedRoles={['Admin']} />} /> {/* Add the new User page route */}
            <Route path="/Group" element={<PrivateRoute element={<Group />} allowedRoles={['Admin']} />} /> {/* Add the new User page route */}
            <Route path="/Change-password" element={<PrivateRoute element={<ChangePassword />} allowedRoles={["*"]} />} />
            <Route path="/ReportA" element={<PrivateRoute element={<ReportA />} allowedRoles={['Admin', 'Report']} />} />
            <Route path="/ReportB" element={<PrivateRoute element={<ReportB />} allowedRoles={['Admin', 'Report']} />} />
            <Route path="/ReportP" element={<PrivateRoute element={<ReportP />} allowedRoles={['Admin', 'Report']} />} />
            <Route path="/ReportUser" element={<PrivateRoute element={<ReportUser />} allowedRoles={['Admin', 'Report']} />} />
            {/* <Route path="/test" element={<Test />} /> */}
            {/* <Route path="/Dashboard" element={<PrivateRoute element={<Dashboard />} allowedRoles={['Admin']} />} /> */}
            {/* <Route path="/disputedata" element={<DisputeData />} /> */}
          </Route>
        </Routes>
      </Router>
    </DocumentProvider>
  );
}

export default App;
