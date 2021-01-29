import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './logo.svg';
import './App.css';

import Navbar from "./components/navbar.component"
import Spotify from "./components/spotify.component";

function App() {
  return (
    <Router >
      <div className="App">
        <div className="container">
          <Navbar />
          <br/>
          <Route path="/" component={Spotify} />
        </div>
      </div>
    </Router>
  );
}

export default App;
