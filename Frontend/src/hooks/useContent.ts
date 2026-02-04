import axios from "axios";
import { useEffect, useState } from "react";
import { BackendURL } from "../config/config";

export function useContent() {
  const [contents, setContents] = useState([]);

  const fetchContent = () => {
    axios
      .get(`${BackendURL}/content`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setContents(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return { contents, refetch: fetchContent }; // Return both data and refetch function
}
