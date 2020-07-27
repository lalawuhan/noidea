import React, { useReducer, useContext, useEffect, useRef } from "react";
import "./App.css";

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
          text: "",
          completed: false,
        },
      ];
    }
    case "delete": {
      return state.filter((item) => item.id !== action.payload);
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
  useEffectOnce(() => {
    const rawData = localStorage.getItem("data");
    dispatch({ type: "reset", payload: JSON.parse(rawData) });
  });
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);
  return (
    <Context.Provider value={dispatch}>
      <h1>Todos</h1>
      <button onClick={() => dispatch({ type: "add" })}>New todo</button>
      <TodosList items={state} />
    </Context.Provider>
  );
}

function TodosList({ items }) {
  return items.map((item) => <TodoItem key={item.id} {...item} />);
}

function TodoItem({ id, completed, text }) {
  const dispatch = useContext(Context); // makes it easier to use context
  return (
    <div>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch({ type: "completed", payload: id })}
      />
      <input type="text" defaultValue={text} />
      <button onClick={() => dispatch({ type: "delete", payload: id })}>
        Delete
      </button>
    </div>
  );
}
export default App;
