import React from "react";
import ContentHeader from "../components/ContentHeader";

export default function Home() {
  console.log("process.env.REACT_APP_API_URL", process.env);

  return (
    <>

      <ContentHeader title="Home" />
      
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* <div className="callout callout-info">
                <h5><i className="fas fa-info"></i> Note:</h5>
                This page has been enhanced for printing. Click the print button at the bottom of the invoice to test.
              </div> */}
              <div className="invoice p-3 mb-3">
                <div className="row">
                  <div className="col-12">
                    <h4>
                      <i className="fas fa-globe" /> NT Corporation
                      <small className="float-right">Date: {new Date().toLocaleDateString()}</small>
                    </h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <p>This is home content..</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
