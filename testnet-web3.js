const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)




getAccountsCallback = function(error, results) {
	let addr = results[1]
	let msg = 'Hello World'
	let hexDataFixed = web3.utils.keccak256(msg)
	console.log("addr = " + addr)
	console.log("hexMsgFixed = " + hexDataFixed)

	web3.eth.sign(hexDataFixed, addr, signCallback);
}

signCallback = function(error, results) {
	console.log("signature = " + results)
	// TODO: split results into r,s,v

	var fs = require('fs');
	var abiFile="./out/verifier.abi"
	var parsedAbi= JSON.parse(fs.readFileSync(abiFile));
	const verifier = new web3.eth.Contract(parsedAbi)
	// TODO: call verifier to check

}


web3.eth.getAccounts(getAccountsCallback)
