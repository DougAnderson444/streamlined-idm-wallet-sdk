"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _didIpid2 = _interopRequireWildcard(require("did-ipid"));

var _humanCryptoKeys = require("human-crypto-keys");

var _errors = require("../../../utils/errors");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Ipid {
  constructor(ipfs, apiMultiAddr, wsMultiAddr) {
    _didIpid.set(this, {
      writable: true,
      value: void 0
    });

    _ipfs.set(this, {
      writable: true,
      value: void 0
    });

    _apiMultiAddr.set(this, {
      writable: true,
      value: void 0
    });

    _wsMultiAddr.set(this, {
      writable: true,
      value: void 0
    });

    _assureDidIpid.set(this, {
      writable: true,
      value: async () => {
        if (!_classPrivateFieldGet(this, _didIpid)) {
          let options = {};

          _classPrivateFieldSet(this, _didIpid, await (0, _didIpid2.default)(_classPrivateFieldGet(this, _ipfs), options, _classPrivateFieldGet(this, _apiMultiAddr), _classPrivateFieldGet(this, _wsMultiAddr)));
        }
      }
    });

    _getMasterPrivateKey.set(this, {
      writable: true,
      value: async params => {
        const {
          privateKey,
          mnemonic,
          seed,
          algorithm
        } = params || {};

        if (privateKey) {
          return privateKey;
        }

        if (seed) {
          const {
            privateKey
          } = await (0, _humanCryptoKeys.getKeyPairFromSeed)(seed, algorithm || "rsa");
          return privateKey;
        }

        if (mnemonic) {
          const {
            privateKey
          } = await (0, _humanCryptoKeys.getKeyPairFromMnemonic)(mnemonic, algorithm || "rsa");
          return privateKey;
        }

        throw new _errors.MissingDidParameters("Please specify the privateKey, seed or mnemonic");
      }
    });

    _classPrivateFieldSet(this, _ipfs, ipfs);

    _classPrivateFieldSet(this, _apiMultiAddr, apiMultiAddr);

    _classPrivateFieldSet(this, _wsMultiAddr, wsMultiAddr);
  }

  async getDid(params) {
    const masterPrivateKey = await _classPrivateFieldGet(this, _getMasterPrivateKey).call(this, params);
    return (0, _didIpid2.getDid)(masterPrivateKey);
  }

  async resolve(did) {
    await _classPrivateFieldGet(this, _assureDidIpid).call(this);
    return _classPrivateFieldGet(this, _didIpid).resolve(did);
  }

  async create(params, operations) {
    let backupData;
    if (params.backupData && params.backupData.privateKey && params.backupData.publicKey) backupData = { ...params.backupData
    };else backupData = await (0, _humanCryptoKeys.generateKeyPair)("rsa");
    await _classPrivateFieldGet(this, _assureDidIpid).call(this);
    const didDocument = await _classPrivateFieldGet(this, _didIpid).create(backupData.privateKey, document => {
      document.addPublicKey({
        id: "idm-master",
        type: "RsaVerificationKey2018",
        publicKeyPem: backupData.publicKey
      });
      operations(document);
    });
    return {
      did: didDocument.id,
      didDocument,
      backupData
    };
  }

  async update(did, params, operations) {
    const masterPrivateKey = await _classPrivateFieldGet(this, _getMasterPrivateKey).call(this, params);
    await _classPrivateFieldGet(this, _assureDidIpid).call(this);
    const didDocument = await _classPrivateFieldGet(this, _didIpid).update(masterPrivateKey, operations);
    return didDocument;
  }

  async isPublicKeyValid(did, publicKeyId) {
    const {
      publicKey = []
    } = await this.resolve(did);
    return publicKey.some(key => key.id === publicKeyId);
  }

}

var _didIpid = new WeakMap();

var _ipfs = new WeakMap();

var _apiMultiAddr = new WeakMap();

var _wsMultiAddr = new WeakMap();

var _assureDidIpid = new WeakMap();

var _getMasterPrivateKey = new WeakMap();

_defineProperty(Ipid, "info", {
  method: "ipid",
  description: "The Interplanetary Identifiers DID method (IPID) supports DIDs on the public and private Interplanetary File System (IPFS) networks.",
  homepageUrl: "https://did-ipid.github.io/ipid-did-method/",
  icons: []
});

const createIpid = (ipfs, apiMultiAddr, wsMultiAddr) => new Ipid(ipfs, apiMultiAddr, wsMultiAddr);

var _default = createIpid;
exports.default = _default;
module.exports = exports.default;