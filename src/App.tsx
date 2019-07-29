import React, { useState, useEffect } from "react";
// import "./App.css";

import { Film } from "./films.d";

// https://swapi.co/api/films/

const App: React.FC = () => {
  const [data, setData] = useState("");
  const [query, setQuery] = useState("redux");
  const [url, setUrl] = useState("https://swapi.co/api/films/?search=New");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const res = await fetch(url);
      const jsonRes = await res.json();
      console.log("----jsonRes: ", jsonRes);
      const results = jsonRes.results as Film[];
      setData(jsonRes.results[0].title);

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return (
    <div className="App">
      <header className="App-header" />
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() => setUrl(`https://swapi.co/api/films/?search=${query}`)}
      >
        Search
      </button>

      {isLoading ? <div>Loading ...</div> : <h1>{data}</h1>}
    </div>
  );
};

export default App;
