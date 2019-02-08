# METAMASK PLUGIN WRAPPER

Wraps plugins into a secure container for code isolation (iframe first, then using SES with plugin that should be sessified)

Implements the message API communications

Will inject the plugin functions and state into visited webpages
Will be ran in metamask extension background page

## Setup

clone and

use plugin-system branches of:
* metamask-extension
* eth-keyring-controller
* eth-hd-keyring

and develop of:
* metamask-plugin-wrapper

run `nvm use v8.13` in each folder
run `npm i` in each folder

run `npm link` in all folders except metamask-extension
run `npm link eth-keyring-controller` in metamask-extension
run `npm link eth-hd-keyring` in metamask-extension
run `npm link metamask-plugin-wrapper` in metamask-extension

run `npm link eth-hd-keyring` in KeyringController folder

## Parameters

* author eth address
(all below will be resolved by an eth smart contract based registrar from above, or from a single URL)
* plugin script name
* plugin script url

* plugin symbol
* plugin image
* plugin eth gateway contract


## Available elements from metamask:

Provider
Blocktracker

## Plugin script rules:

interface for functions
interface for state (read functions)
SES

implement permission system :
to communicate with other plugins
to communicate with inpages



## Message API

### for plugin script:

#### crypto:



json rpc method middleware


* **getPubKey(string hdPath, uint index)** returns bytes:
hdPath: customise the app key path (and can use several), should be formatted as uint/uint/uint (can be extended as much as one likes)
with uint under 0x80000000
can also be hardened using '
Derive an new account for the plugin (along some specific derivation path) and get public key

Should we allow to specify alternative derivation types and path ?
we use BIP32 and BIP44 and some custom path


key types (selected on installation):

for cryptocurrencies' plugins: bip44 extension (eth not allowed)
m / purpose' / coin_type' / account' / change / address_index

or 

for apps/plugins derivation key
m / pluginUniqueId / coin_type' / account' / change / address_index

App keys and not plugin keys
(by domain)
implement in keyring these specific account separetely

I currently assign the first path of the hdPath using the plugin eth address (authorAddress) and the I let the plugin's code add any extra subPath to this. and then he can add an account index.
So for example it would be:
// plugin eth author address
 // 0x37a962652fcb752ae373feb022dd2882a9348b79
 // 37a9 6265 2fcb 752a e373 feb0 22dd 2882 a934 8b79
`m/14249/25189/12235/29994/58227/65200/8925/10370/43316/35705/index_customisable_by_plugin/index_customisable_by_plugin/index_customisable_by_plugin.../index_customisable_by_plugin/ account index`

the `index_customisable_by_plugin/.../index_customisable_by_plugin` part is just a string but it needs to follow the same rules as bip32


* **getXPubKey() returns bytes**:
returns the extended public key of the keyring

the same extendedPublicKey using ethereumjs-wallet/hdkey, no matter the path I choose
one mnemonic = one extended public key for all hdPaths
that means some privacy will be leaked accross plugins
as long as one can guess the hdPath used by the other plugins, one can track the accounts of an user


* **signWithPluginAccount(uint index, bytes dataToSign, string signMethodType) returns bytes**:
Sign with a plugin’s account
this is eth sign ? we should support alternative signing / encryption methods ?

* **requestFunding(address depositAddress, uint suggestedAmount, bytes txData) returns ethTxHash**:
Request funding from an account outside of plugin control
User can select account and amount in metamask
(send Ether tx without tx data)
how secure is it to include txData
how do we handle deposits in tokens ERC20 and others ?
how do dapps recognize who is the depositer if account is different from plugin account (since it's a main metamask account) and if there are no txData (or if txData is already used for ERC20) ?

* **withdrawFromPlugin(address withdrawAddress, bytes txData)**:
0 ether function call from an account outside of plugin control → this is a security problem (tx.origin) => restriction
withdrawAddress should be a depositedAddress already used

* **persistInMetaMaskDb(key, data)**:
Store in MetaMask localdb, specific store for plugin

* **readInMetaMaskDb(key) returns data**:

* **communicateWithPlugin(pluginUniqueId, data)**:
Communicate with another plugin

* **encrypt(uint index, data) return bytes**
Request Encryption

* **decrypt(uint index, bytes) return data**
Request Decryption

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

[]

[]

[] ETHcc talk

[] ETHcc API references and discussion links/forum (github issues?)

[] EIP on app keys


# Notes


- uses metamask/keyringcontroller and metamask/eth-hd-keyring, plugin-system branches
- eip on app / domain keys
- discussions on plugin api specs
- secure the rpc calls of the new methods (stop passing provider to plugins and also disallow other origins to use these rpc calls with some "fake" params)
