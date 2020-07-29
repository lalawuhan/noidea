import React, {
  useReducer,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import useArticles from "./components/useArticles";

function appReducer(state, action) {
  switch (action.type) {
    case "reset": {
      return action.payload;
    }
    case "add": {
      return [
        ...state,
        {
          id: Date.now(),
          text: action.text ? action.text : "",
          completed: false,
        },
      ];
    }
    case "delete": {
      return state.filter((item) => item.id !== action.payload);
    }
    case "addText": {
      return state.map((item) => {
        if (item.id === action.payload) {
          return {
            ...item,
            text: action.text,
          };
        }
        return item;
      });
    }
    case "completed": {
      return state.map((item) => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      });
    }
    default: {
      return state;
    }
  }
}
//context => context provider : any child of provider can access the dispatch value that is provided
//useRef API is built to be more abstract => generic mutable container
const Context = React.createContext();

function useEffectOnce(callback) {
  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current) {
      callback();
      loaded.current = true;
    }
  });
}
function App() {
  const [state, dispatch] = useReducer(appReducer, []); // easy updating of complex pieces of data

  const [query, setQuery] = useState("productivity"); // fetch data on mount
  const [{ data, isLoading, isError }, setUrl] = useArticles(
    "https://hn.algolia.com/api/v1/search?query=productivity",
    {
      hits: [],
    }
  );

  useEffectOnce(() => {
    const rawData = localStorage.getItem("data");
    dispatch({ type: "reset", payload: JSON.parse(rawData) });
  });
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={dispatch}>
      <div>
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
        <ul>
          {data.hits.map((item) => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
              <button onClick={() => dispatch({ type: "add", text: item.url })}>
                {" "}
                Add to List
              </button>
            </li>
          ))}
        </ul>
      </div>
      <h1>To do list</h1>
      <button onClick={() => dispatch({ type: "add" })}>Add to do</button>
      <TodosList items={state} />
    </Context.Provider>
  );
}

function TodosList({ items }) {
  return items.map((item) => <TodoItem key={item.id} {...item} />);
}

function TodoItem({ id, completed, text }) {
  console.log("text", text);
  const dispatch = useContext(Context); // makes it easier to use context
  return (
    <div>
      {/* <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch({ type: "completed", payload: id })}
      /> */}

      <input
        type="text"
        defaultValue={text}
        onChange={(e) =>
          dispatch({ type: "addText", payload: id, text: e.target.value })
        }
      />
      <button onClick={() => dispatch({ type: "delete", payload: id })}>
        Remove
      </button>
    </div>
  );
}
export default App;
