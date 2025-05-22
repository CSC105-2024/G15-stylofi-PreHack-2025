import api from "@/services/api";
import { useState } from "react";

export const useFetch = () => {
  const [fetchError, setFetchError] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      return res.data;
    } catch (e) {
      console.error(e);
      setFetchError(e.response.data.message);
    }
  };

  return { fetchPosts, fetchError, setFetchError };
};
