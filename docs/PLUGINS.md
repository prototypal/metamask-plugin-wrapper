# METAMASK PLUGINS

## Plugins:

Add plugin feature in MetaMask
users inputs plugin ens name

Loads plugin script on url (resolved through ens registrar)
This scripts has access to:
* provider
* app keys api
* running a script in background page
* showing an ui in MetaMask through an iframe


## Plugin data:

User Input:
* plugin ens name

Resolved plugin's metadata (through ENS):
* author eth address (can be used to authenticate messages from plugin)
* plugin script url
* plugin symbol
* plugin image

Other potential metadata fields
* plugin key types:
** app keys
** bip44 keys (also indicate the bip44 code, 60 is reserved for ETH, MetaMask main accounts)
* plugin eth address/gateway contract (if we 

## Plugin script rules:

interface for functions
interface for state (read functions)
SES

implement permission system :
to communicate with other plugins
to communicate with external webpages

## Message API

see App keys
and classical Metamask provider

### for plugin script:

app key api:
json rpc method middleware
private RPC methods for app keys
wrapped and served via an api to the plugin script (specific for the domain determined by the ens name)

usual provider for main account keys


#### plugin script variables and functions (for metamask and inpage-provider):

	renderPluginUI()
	
	mainBalance :
	string for plugin balance in ETH
	
	(todo: handle other currencies / tokens and also multiple ones ?


	// example plugin interface
    this.pluginInterface ={
        actions:[{name: "registerHdPath",
    		  call:this.registerHdPath.bind(this),
    		  params:[{name: "hdPath",
    			   type: "string"},
    			 ]
    		 },
		 {name: "getPubKey",
    		  call:this.getPubKey.bind(this),
    		  params:[{name: "hdPath",
			   type: "string"},
			  {name: "accountIndex",
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

    // EIP 712 data
    this.domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
    ]

    this.channelMessage = [
      {name: "nonce", type: "uint256"},
      {name: "previousSignature", type: "bytes32"},
      {name: "depositCustomHash", type: "bytes32"},
      {name: "sender", type: "Accounts"},
      {name: "recipient1", type: "Accounts"},
      {name: "recipient2", type: "Accounts"},
    ]
    this.accounts = [
      {name: "address", type: "address"},
      {name: "balance", type: "uint256"}
    ]
    //Todo: chainId use network id
    this.domainData = {
      name: "MetaMask Payment Channel Example",
      version: "1",
      chainId: this.networkId,
      verifyingContract: this.address,
      salt: "0x1"
    }
    
  }


#### permissions:
	

### for inpage:


### basic interface in metamask


# TODO

[] provider, determine if we need to pass it to the plugin from the wrapper. if so, then we need to secure the rpc calls such that we don't give access to some of them

[] if so, create new provider for each plugin wrapper

[] research if we need to harden some indexes

[] check xpub key with hardened path indexes

[] how to handle bip44 plugins - create a plugin's type?

[] handle ERC20/non fungible deposits

[] solve privacy issue with xpubkey

[] rework split uid path in wrapper

[] persist app keys

[] ETHcc talk

[] ETHcc API references and discussion links/forum (github issues?)

[] EIP on app keys


# Notes


- uses metamask/keyringcontroller and metamask/eth-hd-keyring, plugin-system branches
- eip on app / domain keys
- discussions on plugin api specs
- secure the rpc calls of the new methods (stop passing provider to plugins and also disallow other origins to use these rpc calls with some "fake" params)


# Questions:

- Need help for UI:
  -iframe for app render ui
  -delimit plugin space...
- New RPC methods for app keys, how can we restrict access to them?
