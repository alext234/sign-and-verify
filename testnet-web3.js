const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)
const abiFile="./out/verifier.abi"
const binFile="./out/verifier.bin"

var signerAddress;
var ethFromAddressToCallVerifier;
var ethFromAddressToDeployVerifier;

// message to be signed
const msg = 'Hello World'
const hexDataFixed = web3.utils.keccak256(msg)


getAccountsCallback = function(error, results) {
	
	// expect to have at least 2 accounts
	ethFromAddressToCallVerifier=results[0]
	ethFromAddressToDeployVerifier=results[0]
	signerAddress=results[1]
	
	console.log("signing the data:")
	console.log("signerAddress= " + signerAddress)
	console.log("hexMsgFixed = " + hexDataFixed)

	web3.eth.sign(hexDataFixed, signerAddress, signCallback);
}



signCallback = function(error, results) {
	console.log("signature = " + results)

	signature = results.substr(2);
	const r = '0x' + signature.slice(0, 64)
	const s = '0x' + signature.slice(64, 128)
	const v = '0x' + signature.slice(128, 130)
	const v_decimal = web3.utils.toDecimal(v)
	console.log('r = ' + r)
	console.log('s = ' + s)
	console.log('v = ' + v)
	console.log('v_decimal = ' + v_decimal)
	
	// deploy the verifier contract and once deployed, call the isSigned method
	deployVerifierContract( contractInstance => {
		contractAddress = contractInstance.options.address
		console.log("verifier deployed at address "+ contractAddress)
		// call the isSigned method on the contract
		contractInstance.methods
			.isSigned(signerAddress, hexDataFixed, v, r, s)
			.call({from: ethFromAddressToCallVerifier})
			.then(result => {
				console.log("isSigned = " + result)
			})
	});

}

function deployVerifierContract(deployCallback) {
	let fs = require('fs');
	let parsedAbi= JSON.parse(fs.readFileSync(abiFile));
	let byteCode = '0x'+fs.readFileSync(binFile)
	console.log("byteCode = " + byteCode)
	
	const verifier = new web3.eth.Contract(parsedAbi)
	verifier.setProvider(provider)
		
	verifier
	.deploy({
		data: byteCode
	})
	.send({
		from: ethFromAddressToDeployVerifier,
		gas: 4500000,
		gasPrice: '18000000000' 
	})
	.on('error',console.log)
	.then(contractInstance=> {
		deployCallback(contractInstance)
	})
}

web3.eth.getAccounts(getAccountsCallback)
