import React, { Component } from 'react';
import './App.css';
import Meme from './Meme';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = { generatedMeme: null, zipcode: null }
    }

    handleGenerateMeme() {
        this.setState({ generatedMeme: <div>hi</div> } )
    }

    handleReset() {
        this.setState({ generatedMeme: null, zipcode: null })
    }

    render() {
        return (
            <div className="Body">
                <div className="Form">
                    <h1>Generate a Weather Meme</h1>
                    <p>Enter a zip-code</p>
                    <input type="text" className="ZipBox"  pattern="[0-9][0-9][0-9][0-9][0-9]"/>
                    <button className="Button" onClick={this.handleGenerateMeme}>Generate!</button>
                </div>
                <div className="Presenter">
                    {this.state.generatedMeme && <button className="Button" onClick={this.handleReset}>reset!</button>}
                </div>
                <footer className="Footer">
                    <a  className="Link" href="https://darksky.net/poweredby/">Powered by Dark Sky</a>
                </footer>
            </div>
        );
    }
}

export default App;
