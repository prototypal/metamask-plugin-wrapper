// const EthContract = require('ethjs-contract')
// const ioClient = require('socket.io-client')
// const BN = require('ethereumjs-util').BN

// const paymentChannel = require("./build/contracts/PaymentChannel.json")
// const abi = paymentChannel.abi


class DummyPlugin  {
  constructor (opts = {}) {

    this.mainBalance = 'dummyBalance'
    this.renderUI = this.renderUI.bind(this)
    this.pluginInterface ={
        actions:[{name: "getPubKey",
    		call:this.getPubKey.bind(this),
    		params:[{name: "accountIndex",
    			 type: "uint"},
    		       ]
    		 },
		 {name: "signMessage",
    		call:this.signMessage.bind(this),
    		params:[{name: "message",
    			 type: "string"},
    		       ]
    		},
    	      ],
      state:[{name: "paymentAllowance",
    	      call: this.paymentAllowance
    	       },
    	     {name: "paymentReceived",
    	      call: this.paymentReceived
    	       }
    	    ]
    }

    this.provider = opts.provider

    this.networkId = opts.networkId

    // // EIP 712 data
    this.domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
    ]

    this.channelMessage = [
      {name: "nonce", type: "uint256"},
      {name: "data", type: "string"},
    ]

    this.domainData = {
      name: "MetaMask Dummy Plugin",
      version: "1",
      chainId: this.networkId,
      verifyingContract: this.address,
      salt: "0x1"
    }
    
  }

  renderUI(){
    return("plugin UI a")
  }

  async signMessage(params){
    console.log(params)
    let message  = {
	  nonce: 0,
	  data: "test message"
	}
    this.signTypedMessage(message, "0x6cCB1DEf4Ff8C4b953B084a220ec51817B65fD87", (signature)=>{
      console.log("signed", message, signature)	
    })
  }
		
  async getPubKey(){
    console.log(this.provider)
    console.log("dummy plugin getPubKey")
    await this.provider.sendAsync(
      {
	method: "getPubKey",
	params: ["test"],
      }, function(err, result){
	console.log("dummy plugin received answer getPubKey", err, result)
      }
    )
  }

  async signTypedMessage(message, fromAccount, cb){
    console.log(message)
    console.log(typeof(message))
    
    let data = JSON.stringify({
      types: {
	EIP712Domain: this.domain,
	ChannelMessage: this.channelMessage,
      },
      domain: this.domainData,
      primaryType: "ChannelMessage",
      message: message
    })

    await this.provider.sendAsync(
      {
	method: "eth_signTypedData_v3",
	params: [fromAccount, data],
	from: fromAccount
      },
      function(err, result) {
    	if (err) {
          return console.error(err);
    	}
	console.log(result)
    	const signature = result
	// signature = signature.substring(2);
    	// const r = "0x" + signature.substring(0, 64);
    	// const s = "0x" + signature.substring(64, 128);
    	// const v = parseInt(signature.substring(128, 130), 16);
	// console.log("r: ", r)
	// console.log("s: ", s)
	// console.log("v: ", v)
	cb(signature)
      }
    )
  }

  async updateValue(key) {
    console.log("updateValue", key)
    let methodName
    let args = []

    switch (key) {
      case 'balance':
        methodName = 'balanceOf'
        args = [ this.owner ]
        break
      default:
        methodName = key
    }

    let result
    try {
      console.log(args)
      result = await this.contract[methodName](...args)
    } catch (e) {
      console.warn(`failed to load ${key} for layer2App at ${this.address}`)
      if (key === 'balance') {
        throw e
      }
    }

    if (result) {
      const val = result[0]
      this[key] = val
      return val
    }

    return this[key]
  }


  
}

module.exports = DummyPlugin
