import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3';

const verifierABI = [{"constant":true,"inputs":[{"name":"hasPrefix","type":"bool"},{"name":"msgHash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"getSignAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"hasPrefix","type":"bool"},{"name":"_addr","type":"address"},{"name":"msgHash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"isSigned","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"}]

class App extends Component {
  
  state = {
    msg:'Hello World',
    web3js:undefined,
    msgHash:'', // the keccak256 hash of msg
    signResult:'', // the signed data of msgHash
    verifierAddress:'0x14dfc2d0e5498cc65c75ce0a2e5c48902553793c', // address of the contract
    verifiedSignAddress:'', // address calculated from the verifier contract
  };
  
  signCallback = (error, results) => {
    if (error) {
      this.setState({signResult:"Error when signing the message"}) 
      console.log(error.toString())
      
    } else {
      this.setState({signResult:results})
      console.log("signed message = "+results)
    }
  }

  getAccountsCallbackToSign = (error, accounts) => {
    if (accounts.length === 0) {
      console.log("There is no account from metamask")
      this.setState({signResult:"Error - There is no account from metamask"})
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
      this.state.web3js.eth.getAccounts(this.getAccountsCallbackToSign);
    }
  }

  handleVerifyButton= () => {
    this.state.web3js.eth.getAccounts((error, accounts)=>{
      if (accounts.length === 0) {
        console.log("no account found")
      } else {
        const ethFromAddress = accounts[0] // address to call the contract from
        const signature = this.state.signResult.substr(2); // remove the '0x'
        const r = '0x' + signature.slice(0, 64)
        const s = '0x' + signature.slice(64, 128)
        const v = '0x' + signature.slice(128, 130)
        const v_decimal = this.state.web3js.utils.toDecimal(v)
        console.log("r="+r)
        console.log("s="+s)
        console.log("v="+v)
        console.log("v_decimal="+v_decimal)
        const verifierContract = new this.state.web3js.eth.Contract(verifierABI, this.state.verifierAddress);
        verifierContract.methods
          .getSignAddress(false, this.state.msgHash, v, r, s)
          .call({from: ethFromAddress})
          .then(result => {
            console.log("sign address = " + result)
            this.setState({verifiedSignAddress:result})
          })
      }
    });

  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sign (off-chain) and verify with smart contract</h1>
        </header>
        
          <h2 className="App-title">Sign</h2>
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
            <span style={{width:'500px'}}>          <b>Signed msg:  </b>
                {this.state.signResult}
            </span>
          </div>
          
          <hr />
          <h2 className="App-title">Verify</h2>
          <div className="container">
            <span style={{width:'500px'}}>          <b>Signed msg:  </b>
              <input onChange={(event) => this.setState({signResult: event.target.value})} 
                value={this.state.signResult}/>     
            </span>
          </div>
          
          <div className="container">
            <span style={{width:'500px'}}>          <b>Verifier contract address:  </b>
              <input onChange={(event) => this.setState({signResult: event.target.value})} 
                value={this.state.verifierAddress}/>     
            </span>
          </div>
          <p>
          <button onClick={()=>this.handleVerifyButton()} >Click to verify</button>
          </p>
          <div className="container">
            <b> Signer address : </b>
           {this.state.verifiedSignAddress}
          </div>

      </div>
    );
  }
}

export default App;
