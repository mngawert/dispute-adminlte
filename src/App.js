import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="wrapper">
      {/* Navbar */}

      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Content Wrapper */}
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Welcome to AdminLTE</h3>
                  </div>
                  <div className="card-body">
                    <p>
                      This is a simple example of integrating AdminLTE with
                      React.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}

      <Footer />
    </div>
  );
}

export default App;
