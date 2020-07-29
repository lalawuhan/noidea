import { useState, useEffect, useReducer } from "react";
export default function useArticles(initialUrl, initialData) {
  const [url, setUrl] = useState(initialUrl);
  //   const [data, setData] = useState(initialData);

  //   const [data, setData] = useState({ hits: [] });
  //   const [url, setUrl] = useState(
  //     "https://hn.algolia.com/api/v1/search?query=productivity"
  //   );
  //   const [isError, setIsError] = useState(null);
  //   const [isLoading, setIsLoading] = useState(false);

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
      //   setIsError(false);
      //   setIsLoading(true);
      dispatch({ type: "INITIAL_FETCH" });

      try {
        const response = await fetch(url);
        const data = await response.json();
        // setData(data);
        dispatch({ type: "SUCCESSFUL_FETCH", payload: data });
      } catch (error) {
        // console.log(error);
        // setIsError(true);
        dispatch({ type: "FAILED_FETCH" });
      }
      //   setIsLoading(false);
    };
    fetchResults();
  }, [url]);
  return [state, setUrl];

  // return [{ data, isLoading, isError }, setUrl];
}
