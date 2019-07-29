import React, { useState, useEffect, useReducer } from "react";
// import "./App.css";

// import { Film } from "./films.d";

interface Film {
  title: string;
}

type AppAction = {
  type: "FETCH_INIT" | "FETCH_SUCCESS" | "FETCH_FAILURE";
  payload: Film[];
};

type AppState = {
  isLoading: boolean;
  isError: boolean;
  data: Film[];
};

const dataFetchReducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

const useSwapi = (initialUrl: string, initialData: Film[]) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT", payload: [] });

      try {
        const res = await fetch(url);
        const jsonRes = await res.json();

        const results = jsonRes.results as Film[];
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: results });
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE", payload: [] });
        }
        console.error(err);
      }
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};

const App: React.FC = () => {
  const [query, setQuery] = useState("hope");

  const [stuff, doFetch] = useSwapi("https://swapi.co/api/films/?search=hope", [
    { title: "" }
  ]);

  if (typeof stuff === "function" || typeof doFetch !== "function")
    return <h1>Error</h1>;

  const { isError, isLoading, data } = stuff;

  const title = data[0] && data[0].title;

  return (
    <div className="App">
      <header className="App-header" />
      <form
        onSubmit={event => {
          doFetch(`https://swapi.co/api/films/?search=${query}`);
          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="button">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? <div>Loading ...</div> : <h1>{title}</h1>}
    </div>
  );
};

export default App;
