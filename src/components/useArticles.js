import { useState, useEffect, useReducer } from "react";
export default function useArticles(initialUrl, initialData) {
  const [url, setUrl] = useState(initialUrl);

  const fetchDataReducer = (state, action) => {
    switch (action.type) {
      case "INITIAL_FETCH":
        return { ...state, isLoading: true, isError: false };
      case "SUCCESSFUL_FETCH":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FAILED_FETCH":
        return { ...state, isLoading: false, isError: true };
      default:
        throw new Error();
    }
  };
  const [state, dispatch] = useReducer(fetchDataReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    const fetchResults = async () => {
      dispatch({ type: "INITIAL_FETCH" });

      try {
        const response = await fetch(url);
        const data = await response.json();
        dispatch({ type: "SUCCESSFUL_FETCH", payload: data });
      } catch (error) {
        dispatch({ type: "FAILED_FETCH" });
      }
    };
    fetchResults();
  }, [url]);
  return [state, setUrl];
}
