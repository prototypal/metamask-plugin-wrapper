//const PluginRegistrar = require('eth-plugin-registrar')


const DummyPluginScript = require('./examples/dummy-plugin/index')
const CfPluginScript = require('./examples/cf-plugin/index')

      
class PluginWrapper {

  constructor (opts = {}){

    console.log("PLUGIN WRAPPER OPTS", opts)
    console.log("constructing plugin wrapper for: ", opts.plugin)
    //Currently we only construct a fresh provider as a stream (to pages) but we should factor out the reused parts for passing the API to a module, too: https://github.com/MetaMask/metamask-extension/blob/capabilities-middleware-example/app/scripts/metamask-controller.js#L1483
// app/scripts/metamask-controller.js:1483
//     ```engine.push(createProviderMiddleware({ provider }))```
// MetaMask/metamask-extensionAdded by GitHub

// Dan Finlay   [7 minutes ago]
// There should be a version of this function that takes an origin, and returns a provider, and it could be used within this function: https://github.com/MetaMask/metamask-extension/blob/capabilities-middleware-example/app/scripts/metamask-controller.js#L1459
// app/scripts/metamask-controller.js:1459
//     ```setupProviderConnection (outStream, origin) {```

    this.selectedAccount = opts.userAddress
    this.provider = opts.provider
    this.networkId = opts.networkId
    this.plugin = opts.plugin

    //actually with this api we don't need to pass the provider directly to the plugins
    // or if we do we should restricts so that the plugins can't call directly the api's rpc methods, nor some others
    // we really want the plugin to have access to read call form the provider, so maybe a subset onlys 
    this.api = {
      getPubKey: this.getAppPubKey.bind(this),
      getXPubKey: this.getXPubKey.bind(this),
      signTransactionAppKey: this.signTransactionAppKey.bind(this)
    }

    const pluginOptions = {
	provider: this.provider,
	networkId: this.networkId,
	api: this.api,
	selectedAccount: this.selectedAccount
      }
    if (this.plugin.scriptUrl == "cf") {
      this.pluginScript = new CfPluginScript(pluginOptions)
    }
    else {
      this.pluginScript = new DummyPluginScript(pluginOptions)
    }



  }




  // 0x37a962652fcb752ae373feb022dd2882a9348b79
  // 37a9 6265 2fcb 752a e373 feb0 22dd 2882 a934 8b79
  // m/14249/25189/12235/29994/58227/65200/8925/10370/43316/35705
  splitUid(uid) {
    let subPath = ""
    for (let k = 0; k < 10; k++) {

      subPath  += parseInt(uid.slice(4*k+2, 4*(k+1)+2), 16)
      if (k != 9) {
	subPath += "/"
      }
    }
    console.log(subPath)
    return subPath
  }

  getXPubKey(params){
    console.log("dummy plugin getXPubKey", params)
    const provider = this.provider
    const xPub = new Promise(function(resolve, reject) {
      provider.sendAsync(
	{
	  method: "getXPubKey",
	  params: params,
	}, function(err, result){
	  console.log("dummy plugin received answer", err, result)
	  resolve(result)
	}
      )
    })
    return xPub
  }
  
  getAppPubKey(params){
    console.log("dummy plugin getPubKey", params)
    // there is a limit on index values, var HARDENED_OFFSET = 0x80000000
    // for the index derived from the authorAddress we need to find a way to split it
    const uidSubPath = this.splitUid(this.plugin.uid)
    const hdPath = "m/" + uidSubPath +"/"  + params[0]
    const index = params[1]
    const newParams = [hdPath, index]
    console.log(newParams)
    const provider = this.provider
    const appPubKey = new Promise(function(resolve, reject){
      provider.sendAsync(
	{
	  method: "getPubKey",
	  params: newParams,
	}, function(err, result){
	  console.log("dummy plugin received answer getPubKey", err, result)
	  resolve(result)
	}
      )
    })
    return appPubKey
  }

  signTransactionAppKey(params){
    console.log("dummy plugin signTx Appkey", params)
    const from = params[0]
    const to = params[1]
    const value = params[2]
    let txParams = {
      "from": from,
      "to": to,
      "gas": "0x76c0", // 30400
      "gasPrice": "0x9184e72a", 
      "value": value,
      "data": "0x"
    }
    const provider = this.provider
    const signedTx = new Promise(function(resolve, reject) {
      provider.sendAsync(
	{
	  method: "signTransactionAppKey",
	  params: [txParams.from, txParams],
	}, function(err, result){
	  console.log("dummy plugin received answer signTxAppKey", err, result)
	  resolve(result)
	}
      )
    })
    return signedTx
  }
  
}

module.exports = PluginWrapper
