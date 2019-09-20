import React, { Component } from "react"; 
import Router from "./Router";
import {BrowserRouter} from 'react-router-dom';

class App extends Component {
  render() {
    return (
     <BrowserRouter>
      <Router />
    </BrowserRouter>
    );
  }
}

export default App;
