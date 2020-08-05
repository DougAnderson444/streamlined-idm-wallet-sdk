## Updated version of js-idm-wallet

https://github.com/ipfs-shipyard/js-idm-wallet

### added 

await wallet.identities.addService('ipid', { privateKey: pem }, { id, type, serviceEndpoint })

Adds a service endpoint a-la https://w3c.github.io/did-core/#service-endpoints

### Build after edits

Remember to npm build to update lib and es folders after adding anything. Otherwise it won't be available in the package.

- Removed window so it works in service worker