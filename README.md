# METAMASK PLUGIN WRAPPER

Wraps plugins into a secure container for code isolation (iframe first, then using SES with plugin that should be sessified)

Implements the message API communications

Will inject the plugin functions and state into visited webpages
Will be ran in metamask extension background page

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


* **getPluginAccountPubKey(uint index)** returns bytes:
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



* **getPluginAccountsXPub(uint account) returns bytes**:
returns the extended public key

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

    this.pluginInterface = {
      actions:[{name: "registerDeposit",
		call:this.registerDeposit.bind(this),
		params:[{name: "depositNonce",
			 type: "uint"},
		       ]
		},
	       {name: "makePayment",
		call:this.makePayment.bind(this),
		params:[{name:"toAddress",
			 type:"address"},
			{name: "value",
			 type: "uint"}
		       ]},
	       {name: "requestWithdrawPayment",
		call:this.withdrawPayment.bind(this),
		params:[{name:"fromAddress",
			 type:"address"},
			{name:"latestMessage",
			 type:"string"}
		       ]
	       },
	       {name: "withdrawPayment",
		call:this.withdrawPayment.bind(this),
		params:[{name:"requestWPNonce",
			 type:"uint"}
		       ]
	       },
	       {name: "requestWithdrawDeposit",
		call:this.withdrawDeposit.bind(this),
	       	params:[{name:"amountWithdrawn",
			 type:"uint"}
		       ]
	       },
	       {name: "withdrawDeposit",
		call:this.withdrawDeposit.bind(this),
	       	params:[{name:"requestWDNonce",
			 type:"uint"
			}]
	       }
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


## basic interface in 
