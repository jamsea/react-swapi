import React, { useState, useEffect, useReducer } from "react";
import Select from "react-select";
import { ValueType } from "react-select/src/types";
import { Crawl } from "./Crawl";
import { Film } from "./films.d";

// Need this for Array.isArray to work with typescript readonly arrays
// relevent issue here: https://github.com/microsoft/TypeScript/issues/17002#issuecomment-494937708
declare global {
  interface ArrayConstructor {
    isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>;
  }
}

interface FilmOption {
  value: string;
  label: string;
  film: Film;
}

interface AppAction {
  type: "FETCH_INIT" | "FETCH_SUCCESS" | "FETCH_FAILURE";
  payload: Film[];
}

interface AppState {
  isLoading: boolean;
  isError: boolean;
  data: Film[];
}

const dataFetchReducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

/**
 * This sends a call to the Star Wars API
 * @param initialRoute See https://www.swapi.co/
 * @param initialFilms Initial film data
 */
const useSwapi = (initialFilms: Film[]) => {
  const url = "https://swapi.dev/api/films/";

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialFilms,
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

        // In real life we could track this error in something like New Relic
        console.error(err);
      }
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]); // Only fire if the url changes, not on every render

  return state;
};

const App: React.FC = () => {
  const emptyFilm: Film = {
    characters: [],
    created: "",
    director: "",
    edited: "",
    episode_id: 0,
    opening_crawl: "",
    planets: [],
    producer: "",
    release_date: "",
    species: [],
    starships: [],
    title: "",
    url: "",
    vehicles: [],
  };

  const fetchState = useSwapi([emptyFilm]);

  const [{ title, opening_crawl: openingCrawlText }, setFilm] = useState(
    emptyFilm
  );

  const [crawl, startCrawl] = useState(false);

  const { isError, isLoading, data } = fetchState;

  const options: FilmOption[] = data.map((option) => {
    return {
      value: option.title,
      label: option.title,
      film: option,
    };
  });

  const selectStyles = { menu: (styles: any) => ({ ...styles, zIndex: 2 }) };

  return (
    <div className="App">
      <Select
        classNamePrefix="list"
        styles={selectStyles}
        defaultValue={options[0]}
        onChange={(filmOption: ValueType<FilmOption>) => {
          if (!filmOption || Array.isArray(filmOption)) {
            return;
          }
          const { film } = filmOption;

          setFilm(film);
          startCrawl(true);
        }}
        options={options}
      />

      {isError && <div>Something went wrong, try reloading.</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Crawl
          title={title}
          openingCrawlText={openingCrawlText}
          crawl={crawl}
          onCrawlEnd={() => startCrawl(false)}
        />
      )}
    </div>
  );
};

export default App;
