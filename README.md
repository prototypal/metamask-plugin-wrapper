# METAMASK PLUGIN WRAPPER

Wraps plugins into a secure container for code isolation (iframe first, then using SES with plugin that should be sessified)

Implements the message API communications

Will inject the plugin functions and state into visited webpages
Will be ran in metamask extension background page

## Metamask Plugins

* [Read here about Plugins](docs/PLUGINS.md)


* [Read here about App Keys](docs/APPKEYS.md)

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

# TODO

[] provider, secure the rpc calls such that we don't give access to some of them

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

[] Allow for multiple hd keyrings (for now in metamask controller we force hd[0]

[] support other keyrings

[] isolate app keys, make sure that an app can't sign with another's app account using pub key (if known)


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
