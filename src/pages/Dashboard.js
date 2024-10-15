import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("test ", config.apiBaseUrl);
    axios
      .get(`${config.apiBaseUrl}/api/User/GetProtectedData`, {
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
