import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3';


class App extends Component {
  
  state = {
    msg:'Hello World',
  };
  
  handleSignButton = () => {

  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        
          <p>Enter message to sign</p>
          <input onChange={(event) => this.setState({msg: event.target.value})} 
            value={this.state.msg}/>	   
          <p>
          <button onClick={()=>this.handleSignButton()} >Click to sign</button>
          </p>
          
          
      </div>
    );
  }
}

export default App;
