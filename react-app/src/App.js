import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3';


class App extends Component {
  
  state = {
    msg:'Hello World',
    web3js:undefined,
    msgHash:'',
    signResult:'',
  };
  
  signCallback = (error, results) => {
    if (error) {
      this.setState({signResult:"Error when signing the message"}) 
      console.log(error.toString())
      
    } else {
      this.setState({signResult:results})
    }
  }

  getAccountsCallback = (error, accounts) => {
    if (accounts.length === 0) {
      console.log("There is no account from metamask")
    }
    else {

      console.log("accounts : "+accounts)
      const hexDataFixed = this.state.web3js.utils.keccak256(this.state.msg)
      this.setState({msgHash:hexDataFixed})
      console.log("hexDataFixed="+hexDataFixed)

      this.state.web3js.eth.sign(hexDataFixed, accounts[0], this.signCallback)
    }
  }
  
  handleSignButton = () => {
    if (typeof window.web3 === 'undefined') {
      console.log('No web3? You should consider trying MetaMask!')
    } else {
      // Use Mist/MetaMask's provider
      this.state.web3js = new Web3(window.web3.currentProvider);
      this.state.web3js.eth.getAccounts(this.getAccountsCallback);
    }
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
          <div className="container">
            <span style={{width:'500px'}}> 
              <b>Msg Hash</b>: {this.state.msgHash}
            </span>
          </div>
          <div className="container">
            <span style={{width:'500px'}}> 
              <b>Signed msg</b>: {this.state.signResult}
            </span>

          </div>
      </div>
    );
  }
}

export default App;
