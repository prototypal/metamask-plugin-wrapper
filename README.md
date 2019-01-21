# METAMASK PLUGIN WRAPPER

Wraps plugins into secure container for code isolation (iframe first, then using SES with plugin that should be sessified)

Implements the message API communications

Will inject the plugin functions and state into visited webpages

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


## Message API Specs

### for plugin script:

### for inpage:
