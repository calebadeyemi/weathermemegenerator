import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            <h1>Generate an image.</h1>
            <input type={"text"}  pattern="[0-9]*"/>
            <button> Generate! </button>
        </header>
      </div>
    );
  }
}

export default App;
