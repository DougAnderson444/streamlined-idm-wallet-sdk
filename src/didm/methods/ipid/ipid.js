// import createDidIpid, { getDid } from "did-ipid";
// import {
//   generateKeyPair,
//   getKeyPairFromMnemonic,
//   getKeyPairFromSeed,
// } from "human-crypto-keys";
// import { MissingDidParameters } from "../../../utils/errors";

// class Ipid {
//   static info = {
//     method: "ipid",
//     description:
//       "The Interplanetary Identifiers DID method (IPID) supports DIDs on the public and private Interplanetary File System (IPFS) networks.",
//     homepageUrl: "https://did-ipid.github.io/ipid-did-method/",
//     icons: [],
//   };

//   #didIpid;
//   #ipfs;
//   #apiMultiAddr;
//   #wsMultiAddr;

//   constructor(ipfs, apiMultiAddr, wsMultiAddr) {
//     this.#ipfs = ipfs;
//     this.#apiMultiAddr = apiMultiAddr;
//     this.#wsMultiAddr = wsMultiAddr;
//   }

//   async getDid(params) {
//     const masterPrivateKey = await this.#getMasterPrivateKey(params);

//     return getDid(masterPrivateKey);
//   }

//   async resolve(did) {
//     await this.#assureDidIpid();

//     return this.#didIpid.resolve(did);
//   }

//   async create(params, operations) {
//     let backupData;

//     if (
//       params.backupData &&
//       params.backupData.privateKey &&
//       params.backupData.publicKey
//     )
//       backupData = { ...params.backupData };
//     else backupData = await generateKeyPair("rsa");

//     await this.#assureDidIpid();
        
//     const didDocument = await this.#didIpid.create(
//       backupData.privateKey,
//       (document) => {
//         document.addPublicKey({
//           id: "idm-master",
//           type: "RsaVerificationKey2018",
//           publicKeyPem: backupData.publicKey,
//         });

//         operations(document);
//       }
//     );

//     return {
//       did: didDocument.id,
//       didDocument,
//       backupData,
//     }
// }

//   async update(did, params, operations) {
//     const masterPrivateKey = await this.#getMasterPrivateKey(params);

//     await this.#assureDidIpid();

//     const didDocument = await this.#didIpid.update(
//       masterPrivateKey,
//       operations
//     );

//     return didDocument;
//   }

//   async isPublicKeyValid(did, publicKeyId) {
//     const { publicKey = [] } = await this.resolve(did);

//     return publicKey.some((key) => key.id === publicKeyId);
//   }

//   #assureDidIpid = async () => {
//     if (!this.#didIpid) {
//       let options = {}
//       this.#didIpid = await createDidIpid(this.#ipfs, options, this.#apiMultiAddr, this.#wsMultiAddr);
//     }
//   };

//   #getMasterPrivateKey = async (params) => {
//     const { privateKey, mnemonic, seed, algorithm } = params || {};

//     if (privateKey) {
//       return privateKey;
//     }

//     if (seed) {
//       const { privateKey } = await getKeyPairFromSeed(seed, algorithm || "rsa");

//       return privateKey;
//     }

//     if (mnemonic) {
//       const { privateKey } = await getKeyPairFromMnemonic(
//         mnemonic,
//         algorithm || "rsa"
//       );

//       return privateKey;
//     }

//     throw new MissingDidParameters(
//       "Please specify the privateKey, seed or mnemonic"
//     );
//   };
// }

// const createIpid = (ipfs, apiMultiAddr, wsMultiAddr) => new Ipid(ipfs, apiMultiAddr, wsMultiAddr);

// export default createIpid;
