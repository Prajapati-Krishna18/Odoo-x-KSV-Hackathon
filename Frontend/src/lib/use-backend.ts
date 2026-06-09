"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface BackendState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBackend<T>(
  path: string,
  token?: string
): BackendState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fetchData() {
    setLoading(true);
    setError(null);

    api
      .get<T>(path, token)
      .then(setData)
      .catch((e) => setError(e.message || "Request failed"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (path && token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [path, token]);

  return { data, loading, error, refetch: fetchData };
}
