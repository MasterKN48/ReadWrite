import React, { Component } from "react";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Router />
        <footer
          className="p-4 text-white text-center"
          style={{ backgroundColor: "#0E2F56" }}
        >
          ReadWrite.io 2020 <br />
          This is dummy project
        </footer>
      </BrowserRouter>
    );
  }
}

export default App;
