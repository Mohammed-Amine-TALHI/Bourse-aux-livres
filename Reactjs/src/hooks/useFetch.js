import { useCallback, useEffect, useState } from "react";
import http, { errorMessage } from "../api/http";

/**
 * GET `url` and expose { data, loading, error, status, reload, setData }.
 * Pass a falsy url to skip the request.
 */
const useFetch = (url) => {
  const [state, setState] = useState({ data: null, loading: Boolean(url), error: null, status: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!url) return undefined;

    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    http
      .get(url)
      .then(({ data }) => active && setState({ data, loading: false, error: null, status: 200 }))
      .catch(
        (error) =>
          active &&
          setState({ data: null, loading: false, error: errorMessage(error), status: error.response?.status || 0 })
      );

    return () => {
      active = false;
    };
  }, [url, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (updater) =>
      setState((prev) => ({ ...prev, data: typeof updater === "function" ? updater(prev.data) : updater })),
    []
  );

  return { ...state, reload, setData };
};

export default useFetch;
