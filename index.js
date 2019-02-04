//const PluginRegistrar = require('eth-plugin-registrar')

const DummyPluginScript = require('./examples/dummy-plugin/index')
const CfPluginScript = require('./examples/cf-plugin/index')

      
class PluginWrapper {

  constructor (opts = {}){
    // this.userAddress = opts.userAddress || '0x0'

    //Currently we only construct a fresh provider as a stream (to pages) but we should factor out the reused parts for passing the API to a module, too: https://github.com/MetaMask/metamask-extension/blob/capabilities-middleware-example/app/scripts/metamask-controller.js#L1483
// app/scripts/metamask-controller.js:1483
//     ```engine.push(createProviderMiddleware({ provider }))```
// MetaMask/metamask-extensionAdded by GitHub

// Dan Finlay   [7 minutes ago]
// There should be a version of this function that takes an origin, and returns a provider, and it could be used within this function: https://github.com/MetaMask/metamask-extension/blob/capabilities-middleware-example/app/scripts/metamask-controller.js#L1459
// app/scripts/metamask-controller.js:1459
//     ```setupProviderConnection (outStream, origin) {```

    
    this.provider = opts.provider
    // const pollingInterval = opts.pollingInterval || 4000
    // this.blockTracker = new BlockTracker({
    //   provider: this.provider,
    //   pollingInterval,
    // })
    this.networkId = opts.networkId

    this.plugin = opts.plugin

    if (this.plugin.scriptUrl == "cf") {
      this.pluginScript = new CfPluginScript({
	provider: this.provider,
	networkId: this.networkId
      })
    }
    else {
      this.pluginScript = new DummyPluginScript({
	provider: this.provider,
	networkId: this.networkId	
      })
    }

    console.log("constructing plugin wrapper for: ", this.plugin)

    // this.layer2Apps = layer2Apps.map((layer2AppOpts) => {
    //   const app = this.createLayer2AppFrom(layer2AppOpts)
    //   return app
    // })

    // console.log("Layer2AppTracker after create: ", layer2Apps)
    
    // this.running = true
    // this.blockTracker.on('latest', this.updateBalances.bind(this))
    // this.blockTracker.start()
  }

  async updateBalances() {
    // const oldBalances = this.serialize()
    // try {
    //   await Promise.all(this.layer2Apps.map((layer2App) => {
    //     return layer2App.updateBalance()
    //   }))

    //   const newBalances = this.serialize()
    //   if (!deepEqual(newBalances, oldBalances)) {
    //     if (this.running) {
    //       this.emit('update', newBalances)
    //     }
    //   }
    // } catch (reason) {
    //   this.emit('error', reason)
    // }
  }

  createLayer2AppFrom (opts) {
    // console.log(opts)
    // const owner = this.userAddress
    // const { address, name, balance, nodeUrl } = opts
    // const provider = this.provider
    // const blockTracker = this.blockTracker
    // const networkId = this.networkId
//    return new Layer2App({ address, name, nodeUrl, balance, owner, provider, blockTracker, networkId })
  }

  add(opts) {
    // const layer2App = this.createLayer2AppFrom(opts)
    // this.layer2Apps.push(layer2App)
  }

  
}

module.exports = PluginWrapper
