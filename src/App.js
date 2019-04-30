import React, { Component } from 'react';
import './App.css';
// import Meme from './Meme';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = { generatedMeme: null, zipcode: 77381 }
    }

    async handleGenerateMeme() {
        const {data: image} = await fetch('/api?zip=' + this.state.zipcode).then(r => r.json());
        this.setState({image});
    }

    handleReset() {
        this.setState({ image: null, zipcode: null })
    }

    handleInputChange(event) {
        if (event.target.value.match(/(^\d{5}$)|(^\d{5}-\d{4}$)/)) {
            console.log("valid zip detected " + event.target.value)
            this.setState({zipcode: event.target.value})
        }
    }

    render() {
        return (
            <div className="Body">
                <div className="Form">
                    <h1>Generate a Weather Meme</h1>
                    <p>Enter a zip-code</p>
                    <input type="text" className="ZipBox"  pattern="(^\d{5}$)|(^\d{5}-\d{4}$)" onChange={event => this.handleInputChange(event)}/>
                    <button className="Button" onClick={() => this.handleGenerateMeme()}>Generate!</button>
                </div>
                <div className="Presenter">
                    {
                        this.state.image &&
                        <div>
                            <img src={this.state.image} />
                            <button className="Button"
                                    onClick={() => this.handleReset()}>reset!
                            </button>
                        </div>
                    }
                </div>
                <footer className="Footer">
                    <a  className="Link" href="https://darksky.net/poweredby/">Powered by Dark Sky</a>
                </footer>
            </div>
        );
    }
}

export default App;
