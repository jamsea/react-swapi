import React, { useState, useEffect, useReducer } from "react";
import Select from "react-select";
import { ValueType } from "react-select/src/types";

import { Crawl } from "./Crawl";
// import "./App.css";

// import { Film } from "./films.d";

// Need this for Array.isArray to work with typescrip readonly arrays
// relevent issue here: https://github.com/microsoft/TypeScript/issues/17002#issuecomment-494937708
declare global {
  interface ArrayConstructor {
    isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>;
  }
}

interface Film {
  title: string;
  opening_crawl: string;
}

interface FilmOption {
  value: string;
  label: string;
  film: Film;
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
  const [film, setFilm] = useState({
    title: "",
    opening_crawl: "Test"
  });
  const [fade, setFade] = useState(false);

  const { title, opening_crawl } = film;

  const [fetchState, doFetch] = useSwapi("https://swapi.co/api/films", [
    { title: "", opening_crawl: "" }
  ]);

  if (typeof fetchState === "function" || typeof doFetch !== "function")
    return <h1>Error</h1>;

  const { isError, isLoading, data } = fetchState;

  const options: FilmOption[] = data.map(option => {
    return {
      value: option.title,
      label: option.title,
      film: option
    };
  });

  console.log(options);

  return (
    <div className="App">
      <header className="App-header" />
      <Select
        defaultValue={options[0]}
        onChange={(filmOption: ValueType<FilmOption>) => {
          if (!filmOption || Array.isArray(filmOption)) {
            return;
          }
          const { film } = filmOption;

          setFilm(film);
          setFade(true);
        }}
        options={options}
      />

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Crawl
          title={title}
          crawl={opening_crawl}
          fade={fade}
          onFadeEnd={() => setFade(false)}
        />
      )}
    </div>
  );
};

export default App;
