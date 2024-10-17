import React from "react";

export default function Home() {
  console.log("process.env.REACT_APP_API_URL", process.env);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Welcome to AdminLTE</h3>
          </div>
          <div className="card-body">
            <p>This is a simple example of integrating AdminLTE with React.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
