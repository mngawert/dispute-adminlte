import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/api/User/GetProtectedData", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        // Handle user data
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div>Dashboard - {data} </div>;
}
