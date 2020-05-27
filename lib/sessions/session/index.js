"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "assertSessionOptions", {
  enumerable: true,
  get: function () {
    return _asserts.assertSessionOptions;
  }
});
exports.loadSessions = exports.removeSession = exports.createSession = void 0;

var _nanoid = require("nanoid");

var _idmSignatures = require("idm-signatures");

var _storageKeys = require("./utils/storage-keys");

var _crypto = require("../../utils/crypto");

var _did = require("../../utils/did");

var _asserts = require("./utils/asserts");

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const DEFAULT_MAX_AGE = 7776000000;
const nanoid = (0, _nanoid.customAlphabet)('1234567890abcdef', 32);

class Session {
  constructor(descriptor) {
    _descriptor.set(this, {
      writable: true,
      value: void 0
    });

    _signer.set(this, {
      writable: true,
      value: void 0
    });

    _createSigner.set(this, {
      writable: true,
      value: () => {
        const {
          privateKeyPem,
          keyPath
        } = this.getKeyMaterial();
        const didUrl = (0, _did.formatDid)({
          did: this.getIdentityDid(),
          fragment: this.getDidPublicKeyId()
        });
        return (0, _idmSignatures.createSigner)(didUrl, privateKeyPem, keyPath);
      }
    });

    _classPrivateFieldSet(this, _descriptor, descriptor);
  }

  getId() {
    return _classPrivateFieldGet(this, _descriptor).id;
  }

  getAppId() {
    return _classPrivateFieldGet(this, _descriptor).appId;
  }

  getIdentityId() {
    return _classPrivateFieldGet(this, _descriptor).identityId;
  }

  getIdentityDid() {
    return _classPrivateFieldGet(this, _descriptor).identityDid;
  }

  getCreatedAt() {
    return _classPrivateFieldGet(this, _descriptor).createAt;
  }

  getDidPublicKeyId() {
    return _classPrivateFieldGet(this, _descriptor).didPublicKeyId;
  }

  getKeyMaterial() {
    return _classPrivateFieldGet(this, _descriptor).keyMaterial;
  }

  getMeta() {
    return _classPrivateFieldGet(this, _descriptor).meta;
  }

  isValid() {
    return _classPrivateFieldGet(this, _descriptor).expiresAt > Date.now();
  }

  getSigner() {
    if (!_classPrivateFieldGet(this, _signer)) {
      _classPrivateFieldSet(this, _signer, _classPrivateFieldGet(this, _createSigner).call(this));
    }

    return _classPrivateFieldGet(this, _signer);
  }

}

var _descriptor = new WeakMap();

var _signer = new WeakMap();

var _createSigner = new WeakMap();

const createSession = async (identity, app, options, storage) => {
  options = {
    maxAge: DEFAULT_MAX_AGE,
    ...options
  };
  const currentDevice = identity.devices.getCurrent();
  const keyMaterial = (0, _crypto.generateDeviceChildKeyMaterial)(currentDevice.keyMaterial.privateExtendedKeyBase58);
  const descriptor = {
    id: nanoid(),
    identityId: identity.getId(),
    identityDid: identity.getDid(),
    appId: app.id,
    createAt: Date.now(),
    expiresAt: Date.now() + options.maxAge,
    didPublicKeyId: currentDevice.didPublicKeyId,
    keyMaterial,
    meta: options.meta
  };
  await storage.set((0, _storageKeys.getSessionKey)(descriptor.id), descriptor);
  return new Session(descriptor);
};

exports.createSession = createSession;

const removeSession = async (sessionId, storage) => {
  const key = (0, _storageKeys.getSessionKey)(sessionId);
  const sessionDescriptor = await storage.get(key);

  if (!sessionDescriptor) {
    return;
  }

  await storage.remove(key);
};

exports.removeSession = removeSession;

const loadSessions = async storage => {
  const descriptors = await storage.list({
    gte: _storageKeys.DESCRIPTOR_KEY_PREFIX,
    lte: `${_storageKeys.DESCRIPTOR_KEY_PREFIX}\xFF`,
    keys: false
  });
  const sessions = descriptors.map(descriptor => new Session(descriptor)); // Return a object indexed by the session key, while removing expired sessions

  return sessions.reduce((acc, session) => {
    const sessionId = session.getId();

    if (session.isValid()) {
      acc[sessionId] = session;
    } else {
      storage.remove((0, _storageKeys.getSessionKey)(sessionId)).catch(err => console.warn(`Unable to remove expired session with id "${sessionId}".  Will retry on reload.`, err));
    }

    return acc;
  }, {});
};

exports.loadSessions = loadSessions;