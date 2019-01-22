# METAMASK PLUGIN WRAPPER

Wraps plugins into a secure container for code isolation (iframe first, then using SES with plugin that should be sessified)

Implements the message API communications

Will inject the plugin functions and state into visited webpages
Will be ran in metamask extension background page

## Parameters

* author eth address
(all below will be resolved by an eth smart contract based registrar from above, or from a single URL)
* plugin script name
* plugin symbol
* plugin image
* plugin script url
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



## Message API Specs

### for plugin script:
* getPluginAccountPubKey(uint index) returns bytes:
Derive an new account for the plugin (along some specific derivation path) and get public key

Should we allow to specify alternative derivation types and path ?
we use BIP32 and BIP44 and some custom path

key types:
bip44 extension (eth not allowed)
m / purpose' / coin_type' / account' / change / address_index
plugin derivation key
m / pluginUniqueId / coin_type' / account' / change / address_index

* **getPluginAccountsXPub(uint account) returns bytes**:
returns the extended public key

* **signWithPluginAccount(uint index, bytes dataToSign) returns bytes**:
Sign with a plugin’s account
this is eth sign ? we should support alternative signing / encryption methods ?
* **requestFunding(address depositAddress, uint suggestedAmount) returns ethTxHash**:
Request funding from an account outside of plugin control 
User can select account and amount in metamask
(send Ether tx without tx data)
* **withdrawFromPlugin(address withdrawAddress)**:
withdrawAddress should be a depositedAddress already used
Withdraw ? 0 ether function call from an account outside of plugin control → this is a security problem (MITM), but if not from an account outside, how do we pay the gas?
* **persistInMetaMaskDb(key, data)**:
Store in MetaMask localdb, specific store for plugin
* **readInMetaMaskDb(key) returns data**:
* **communicateWithPlugin(pluginUniqueId, data)**:
Communicate with another plugin
* **encrypt(uint index, data) return bytes**
Request Encryption / Decryption
* **decrypt(uint index, bytes) return data**


### for inpage:
