class DummyPlugin  {
  constructor (opts = {}) {

    this.mainBalance = 'dummyBalance'
    this.renderUI = this.renderUI.bind(this)
    this.pluginInterface ={
        actions:[{name: "getXPubKey",
    		  call:this.getXPubKey.bind(this),
    		  params:[]
    		 },
		 {name: "getAppPubKey  -  AppAccount",
    		  call:this.getAppPubKey.bind(this),
    		  params:[{name: "subHdPath",
			   type: "string"},
			  {name: "accountIndex",
    			   type: "uint"},
    			 ]
    		 },
		 {name: "sendTransactionAppKey - AppAccount",
    		  call:this.signTransactionAppKey.bind(this),
    		  params:[{name: "from",
    			   type: "string"},
			  {name: "to",
			   type: "string"},
			  {name: "value",
    			   type: "uint"},			  
    			 ]
    		 },
		 {name: "sendFromMainAccount",
    		  call:this.sendFromMainAccount.bind(this),
    		  params:[{name: "to",
    			   type: "string"},			  
			  {name: "amount_wei",
    			   type: "uint"},			  
    			 ]
    		 },
		 {name: "signMessageFromMainAccount",
    		  call:this.signMessageFromMainAccount.bind(this),
    		  params:[{name: "message",
    			   type: "string"},
    			 ]
    		 },
    		],
      state:[{name: "dummyState",
    	      call: this.balance
    	     },
    	     {name: "dummyState2",
    	      call: this.balance2
    	     }
    	    ]
    }
    
    this.provider = opts.provider

    this.networkId = opts.networkId
    this.mainAccount = opts.selectedAccount

    console.log(opts)
    this.api = opts.api
    
  }

  renderUI(){
    return("plugin UI Dummy plugin " +
	   "                       " +
	   "  xPubKey: " + this.xPubKey +
	   "  appPubKey: " + this.appPubKey  +
	   " last Call result: " + JSON.stringify(this.result,null,'\t')
	  )
  }

		
  async getXPubKey(params){
    console.log("dummy plugin getXPubKey", params)
    const ans = await this.api.getXPubKey(params)
    console.log(ans)
    this.xPubKey = ans.result
    console.log(this.xPubKey)
  }
  
  async getAppPubKey(params){
    console.log("dummy plugin getPubKey", params)
    const ans = await this.api.getPubKey(params)
    console.log(ans)
    this.appPubKey = ans.result
  }

  async signTransactionAppKey(params){
    const ans = await this.api.signTransactionAppKey(params)
    console.log(ans)
    this.result = ans.result
  }
  
  async signTypedMessageAppKey(params){
  }






  // Using Web3 for main accounts

  
  async sendFromMainAccount(params) {
    let txParams = {
      "from": this.mainAccount,
      "to": params[0],
      "gas": "0x76c0", // 30400
      "gasPrice": "0x9184e72a", 
      "value": params[1],
      "data": "0x"
    }
    await this.provider.sendAsync(
      {
	method: "eth_sendTransaction",
	params: [txParams],
      },
      function(err, result) {
    	if (err) {
          return console.error(err);
    	}
	console.log(result)
	cb(result)
      }
    )
    
  }



  
  async signMessageFromMainAccount(params){
    console.log(params)
    let message  = {
	  nonce: 0,
	  data: "test message"
	}
    this.signTypedMessageFromMainAccount(message, this.mainAccount, (signature)=>{
      console.log("signed", message, signature)	
    })
  }


  async signTypedMessageFromMainAccount(message, fromAccount, cb){
    console.log(message)
    console.log(typeof(message))

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
      salt: "0x12345611111111111"
    }

    
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



  
}

module.exports = DummyPlugin
