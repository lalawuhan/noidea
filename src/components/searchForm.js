import React, { useState } from "react";
import useArticles from "./useArticles";
import useLocalStorage from "./useLocalStorage";

export default function SearchForm() {
  const [query, setQuery] = useState("productivity"); // fetch data on mount
  const [{ data, isLoading, isError }, setUrl] = useArticles(
    "https://hn.algoxlia.com/api/v1/search?query=productivity",
    {
      hits: [],
    }
  );
  const [savedArticles, setSave] = useLocalStorage("saved articles:", []);
  function handleAdd(url, title) {
    const newList = savedArticles.concat({ url, title });
    setSave(newList);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map((item) => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
              <button onClick={() => handleAdd(item.url, item.title)}>
                {" "}
                Add to List
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        {savedArticles.map((article) => (
          <li>
            <a href={article.url}>{article.title}</a>
          </li>
        ))}
      </div>
    </>
  );
}
