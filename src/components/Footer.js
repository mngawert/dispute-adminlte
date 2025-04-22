import React from "react";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="float-right d-none d-sm-inline">
        <b>NT Adjustment</b>{" "}
        <img src="dist/img/line_adjust.jpg" style={{ width: "50px", height: "50px" }} />
      </div>
      <strong>
        Copyright &copy; 2024 <a href="#">NT</a>.
      </strong>{" "}
      All rights reserved.
      <br />
      Version 1.0
    </footer>
  );
}
