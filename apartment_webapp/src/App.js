import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './logo.svg';
import './App.css';

import Navbar from "./components/navbar.component"
import DevicesList from "./components/devices-list.component";
import EditDevice from "./components/edit-device.component";
import CreateDevice from "./components/create-device.component";

function App() {
  return (
    <Router >
      <div className="App">
        <div className="container">
          <Navbar />
          <br/>
          <Route path="/" exact component={DevicesList} />
          <Route path="/edit/:id" component={EditDevice} />
          <Route path="/create" component={CreateDevice} />
        </div>
      </div>
    </Router>
  );
}

export default App;
