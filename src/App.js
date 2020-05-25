import React from "react";
import "./App.css";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

function App() {
  return (
    <div className="App">
      <section className="masthead" role="img" aria-label="Image Description">
        <h1>SHOW</h1>
        <a href="#explainer">
          <button>What is This?</button>
        </a>
      </section>
      <section className="navigateRooms">
        <CreateRoom />
        <JoinRoom />
      </section>
      <div>
        <img
          className="flourish"
          src="./flourish.svg"
          alt="beautiful flourish"
        />
        <a id="explainer">
          <h2 className="explainer">Enjoying The Show</h2>
        </a>
      </div>
    </div>
  );
}

export default App;
