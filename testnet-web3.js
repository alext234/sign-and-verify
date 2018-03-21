const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)


const msg = 'Hello World'
const hexDataFixed = web3.utils.keccak256(msg)


getAccountsCallback = function(error, results) {
	const addr = results[1]
	console.log("addr = " + addr)
	console.log("hexMsgFixed = " + hexDataFixed)

	web3.eth.sign(hexDataFixed, addr, signCallback);
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
	

	// deploy the verifier contract
	var fs = require('fs');
	var abiFile="./out/verifier.abi"
	var binFile="./out/verifier.bin"
	var parsedAbi= JSON.parse(fs.readFileSync(abiFile));
	var byteCode = '0x'+fs.readFileSync(binFile)
	console.log("byteCode = " + byteCode)
	//const contractAddress='0x7cc98f5ca41692551a6d102a8d97471baa68fa11'
	//const verifier = new web3.eth.Contract(parsedAbi, 
	//		contractAddress)
	//verifier.setProvider(provider)
	
	const verifier = new web3.eth.Contract(parsedAbi)
	verifier.setProvider(provider)
	verifier.options.data='0x00'
	const ethFromAddress='0xc216b37229100cd054ac9e08772f59bcb7fa4a13'
		
	verifier
	.deploy({
		data: byteCode
	})
	.send({
		from: ethFromAddress,
		gas: 4500000,
		gasPrice: '18000000000' 
	})
	.on('error',console.log)
	.then(contractInstance=> {
		contractAddress = contractInstance.options.address
		console.log("verifier deployed at address "+ contractAddress)
		// call the isSigned method on the contract
		const ethFromAddress='0xc216b37229100cd054ac9e08772f59bcb7fa4a13'
		const signerAddress='0x4633C93EF85845AfFF73E606c9Daef4367fAc755'
		contractInstance.methods
			.isSigned(signerAddress, hexDataFixed, v, r, s)
			.call({from: ethFromAddress})
			.then(result => {
				console.log("isSigned = " + result)
			})
	})

	

}


web3.eth.getAccounts(getAccountsCallback)
