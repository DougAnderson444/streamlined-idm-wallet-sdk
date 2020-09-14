"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsDidHyper = _interopRequireWildcard(require("js-did-hyper"));

var _humanCryptoKeys = require("human-crypto-keys");

var _errors = require("../../../utils/errors");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Hyperid {
  constructor(Hyperdrive) {
    _didHyperId.set(this, {
      writable: true,
      value: void 0
    });

    _Hyperdrive.set(this, {
      writable: true,
      value: void 0
    });

    _assureDidHyper.set(this, {
      writable: true,
      value: async () => {
        if (!_classPrivateFieldGet(this, _didHyperId)) {
          _classPrivateFieldSet(this, _didHyperId, await (0, _jsDidHyper.default)(_classPrivateFieldGet(this, _Hyperdrive)));
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

    _classPrivateFieldSet(this, _Hyperdrive, Hyperdrive);
  }

  async getDid(params) {
    return (0, _jsDidHyper.getDid)(params.drive);
  }

  async resolve(did) {
    await _classPrivateFieldGet(this, _assureDidHyper).call(this);
    return await _classPrivateFieldGet(this, _didHyperId).resolve(did);
  }

  async create(params, operations) {
    let backupData;
    if (params.backupData && params.backupData.privateKey && params.backupData.publicKey) backupData = { ...params.backupData
    };else backupData = await (0, _humanCryptoKeys.generateKeyPair)("rsa");
    await _classPrivateFieldGet(this, _assureDidHyper).call(this);
    const didDocument = await _classPrivateFieldGet(this, _didHyperId).create(params.drive, document => {
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

  async update(drive, operations) {
    await _classPrivateFieldGet(this, _assureDidHyper).call(this);
    const didDocument = await _classPrivateFieldGet(this, _didHyperId).update(drive, operations);
    return didDocument;
  }

  async isPublicKeyValid(did, publicKeyId) {
    const {
      publicKey = []
    } = await this.resolve(did);
    return publicKey.some(key => key.id === publicKeyId);
  }

}

var _didHyperId = new WeakMap();

var _Hyperdrive = new WeakMap();

var _assureDidHyper = new WeakMap();

var _getMasterPrivateKey = new WeakMap();

_defineProperty(Hyperid, "info", {
  method: "hyper",
  description: "The Hyper-protocol DID method (IPID) supports DIDs on the hyper-protocol network.",
  homepageUrl: "https://github.com/DougAnderson444/js-did-hyper",
  icons: []
});

const createHyperid = Hyperdrive => new Hyperid(Hyperdrive);

var _default = createHyperid;
exports.default = _default;
module.exports = exports.default;