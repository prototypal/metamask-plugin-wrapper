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

    this.provider = opts.provider
    this.networkId = opts.networkId
    this.plugin = opts.plugin

    //actually with this api we don't need to pass the provider directly to the plugins
    // or if we do we should restricts so that the plugins can't call directly the api's rpc methods, nor some others
    // we really want the plugin to have access to read call form the provider, so maybe a subset onlys 
    this.api = {
      getPubKey: this.getPubKey.bind(this),
      getXPubKey: this.getXPubKey.bind(this),
    }
    
    if (this.plugin.scriptUrl == "cf") {
      this.pluginScript = new CfPluginScript({
	provider: this.provider,
	networkId: this.networkId,
	api: this.api
      })
    }
    else {
      this.pluginScript = new DummyPluginScript({
	provider: this.provider,
	networkId: this.networkId,
	api: this.api	
      })
    }



  }


  async getXPubKey(params){
    console.log("dummy plugin getXPubKey", params)
    await this.provider.sendAsync(
      {
	method: "getXPubKey",
	params: params,
      }, function(err, result){
	console.log("dummy plugin received answer", err, result)
      }
    )
  }


  async getPubKey(params){
    console.log("dummy plugin getPubKey", params)
    const hdPath = "m/" + parseInt(this.plugin.authorAddress, 16) +"/"  + params[0]
    const index = params[1]
    const newParams = [hdPath, index]
    console.log(newParams)
    await this.provider.sendAsync(
      {
	method: "getPubKey",
	params: newParams,
      }, function(err, result){
	console.log("dummy plugin received answer getPubKey", err, result)
      }
    )
  }
  

  
}

module.exports = PluginWrapper
