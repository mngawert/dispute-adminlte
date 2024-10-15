import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

const DisputeData = () => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}/api/Dispute/GetDisputesByAccountNum?AccountNum=000604089357`)
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
                        <th>Account Num</th>
                        <th>Dispute Seq</th>
                        <th>Bill Seq</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disputes.map((dispute, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{dispute.accountNum}</td>
                          <td>{dispute.disputeSeq}</td>
                          <td>{dispute.billSeq}</td>
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
