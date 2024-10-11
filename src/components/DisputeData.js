import React, { useState, useEffect } from "react";
import axios from "axios";

const DisputeData = () => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/GetDispute")
      .then((response) => {
        setDisputes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the dispute data!", error);
      });
  }, []);

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Dispute Data</h3>
                </div>
                <div className="card-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Account Number</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disputes.map((dispute, index) => (
                        <tr key={index}>
                          <td>{dispute.id}</td>
                          <td>{dispute.accountNumber}</td>
                          <td>{dispute.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisputeData;
