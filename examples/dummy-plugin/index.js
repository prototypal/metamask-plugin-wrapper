class DummyPlugin  {
  constructor (opts = {}) {

    this.mainBalance = 'dummyBalance'
    this.renderUI = this.renderUI.bind(this)
    this.pluginInterface ={
        actions:[{name: "appKey_eth_getPublicKey",
    		  call:this.appKey_eth_getPublicKey.bind(this),
    		  params:[{name: "subHdPath",
			   type: "string"}
			 ]
    		 },
		 {name: "appKey_eth_getAddress  -  AppAccount",
    		  call:this.appKey_eth_getAddress.bind(this),
    		  params:[{name: "subHdPath",
			   type: "string"}
    			 ]
    		 },
		 {name: "appKey_eth_sendTransaction - AppAccount",
    		  call:this.appKey_eth_signTransaction.bind(this),
    		  params:[{name: "from",
    			   type: "string"},
			  {name: "to",
			   type: "string"},
			  {name: "value",
    			   type: "uint"},			  
    			 ]
    		 },
		 {name: "appKey_eth_signTypedMessage - AppAccount",
    		  call:this.appKey_eth_signTypedMessage.bind(this),
    		  params:[{name: "from",
    			   type: "string"},
			  {name: "message",
    			   type: "uint"},			  
    			 ]
    		 },
		 {name: "eth_sendFromMainAccount",
    		  call:this.sendFromMainAccount.bind(this),
    		  params:[{name: "to",
    			   type: "string"},			  
			  {name: "amount_wei",
    			   type: "uint"},			  
    			 ]
    		 },
		 {name: "eth_signTypedMessageFromMainAccount",
    		  call:this.signTypedMessageFromMainAccount.bind(this),
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


  mainProcess(){
    setInterval(()=>{
      console.log("script background process alive")
    }, 5000)
  }



  // IFrame content
  // Pb: how do we pass JS functions (that also use the API)
  // Post message api
  // and listen in plugin view and link there to pluginscript

  // Render UI should be sessified such that no other JS can be ran in script ?

  // when using inline to define the functions
  //Refused to execute inline event handler because it violates the following Content Security Policy directive: "script-src 'self' blob: filesystem: chrome-extension-resource:". Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution.



  renderUI(){
    return(
      "<script>function submit() {alert(\"it works\")} </script>"+
	"<div>" +
	"plugin UI Dummy plugin " +
	"                       " +
	"  xPubKey: " + this.xPubKey +
	"  appAddress: " + this.appAddress  +
	" last Call result: " + JSON.stringify(this.result,null,'\t') +
	"<p onmousedown=\"submit()\">Click the text!</p>" +	
	"</div>"
    )
  }

		
  async appKey_eth_getPublicKey(params){
    console.log("dummy plugin getXPubKey", params)
    const ans = await this.api.appKey_eth_getPublicKey(params)
    console.log(ans)
    this.xPubKey = ans.result
    console.log(this.xPubKey)
  }
  
  async appKey_eth_getAddress(params){
    console.log("dummy plugin getPubKey", params)
    const ans = await this.api.appKey_eth_getAddress(params)
    console.log(ans)
    this.appAddress = ans.result
  }

  async appKey_eth_signTransaction(params){
    const ans = await this.api.appKey_eth_signTransaction(params)
    console.log(ans)
    this.result = ans.result
  }
  
  async appKey_eth_signTypedMessage(params){
    const finalMessage = this.prepareTypedMessage(params[0], params[1])
    const ans = await this.api.appKey_eth_signTypedMessage([params[0], finalMessage])
    console.log(ans)
    const signature = ans.result.substring(2)
    const r = "0x" + signature.substring(0, 64)
    const s = "0x" + signature.substring(64, 128)
    const v = parseInt(signature.substring(128, 130), 16)
    // console.log("r: ", r)
    // console.log("s: ", s)
    // console.log("v: ", v)
    this.result = " r " + r + " s " + s + " v " + v
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

  
  async signTypedMessageFromMainAccount(params){
    console.log(params)
    const finalMessage = this.prepareTypedMessage(this.mainAccount, params[0])
    console.log("message:", finalMessage)
    this.result = await this.provider.sendAsync(
      {
	method: "eth_signTypedData_v3",
	params: [this.mainAccount, finalMessage],
	from: this.mainAccount
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
	return signature
      }
    )
  }


  prepareTypedMessage(fromAccount, message){
    // // EIP 712 data
    const domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
    ]

    const channelMessage = [
      {name: "data", type: "string"},
    ]

    const domainData = {
      name: "MetaMask Dummy Plugin",
      version: "1",
      chainId: this.networkId,
      verifyingContract: this.address,
      salt: "0x12345611111111111"
    }

    let finalMessage = JSON.stringify({
      types: {
	EIP712Domain: domain,
	ChannelMessage: channelMessage,
      },
      domain: domainData,
      primaryType: "ChannelMessage",
      message: { "data": message }
    })
    return finalMessage
  }



  
}

module.exports = DummyPlugin
