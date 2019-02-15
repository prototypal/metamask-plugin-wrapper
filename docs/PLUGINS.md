# METAMASK PLUGINS

## Plugins:

Add plugin feature in MetaMask
users inputs plugin ens name

Loads plugin script on url (resolved through ens registrar)
This scripts has access to:
* provider
* app keys api for the plugin's domain
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
  * app keys
  * bip44 keys (also indicate the bip44 code, 60 is reserved for ETH, MetaMask main accounts)
* plugin eth address/gateway contract (if we 

## Plugin script rules:

interface for functions
interface for state (read functions)


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

### temporary basic interface in metamask for testing (until I implement the iframe)

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


### (TBD) Inject

### (TBD) Iframed UI controlled by the plugin script

NOT Implemented yet

### (TBD) Plugin code isolation

#### permissions

##### In Metamask
for now, upon installation the user grants all permissions to plugin.
-request actions from main accounts
-access to domain app keys
-sign with domain app keys without requesting confirmation from user
-(tbd) store in local db (domain isolated)
-(tbd) run script in background metamask
-(tbd) show ui in metamask
-(tbd) inject in webpages the plugin functions along metamask

later we should allow different level of permissions (including new permissions for new features)


#### for external webpages:

similar to 1102, pages will be able to ask to connect to your plugin and use the functions you are pasing through the interface (but won't have acces to the app key api themselves)




