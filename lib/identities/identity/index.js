"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "generateCurrentDevice", {
  enumerable: true,
  get: function () {
    return devicesFns.generateCurrentDevice;
  }
});
Object.defineProperty(exports, "assertApp", {
  enumerable: true,
  get: function () {
    return appsFns.assertApp;
  }
});
Object.defineProperty(exports, "assertDeviceInfo", {
  enumerable: true,
  get: function () {
    return _asserts.assertDeviceInfo;
  }
});
Object.defineProperty(exports, "assertProfileDetails", {
  enumerable: true,
  get: function () {
    return _asserts.assertProfileDetails;
  }
});
exports.loadIdentities = exports.removeIdentity = exports.createIdentity = exports.peekProfileDetails = void 0;

var _pReduce = _interopRequireDefault(require("p-reduce"));

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _idmSignatures = require("idm-signatures");

var _did = require("../../utils/did");

var _crypto = require("../../utils/crypto");

var _errors = require("../../utils/errors");

var _storageKeys = require("./utils/storage-keys");

var _orbitdb2 = require("./utils/orbitdb");

var devicesFns = _interopRequireWildcard(require("./devices"));

var backupFns = _interopRequireWildcard(require("./backup"));

var profileFns = _interopRequireWildcard(require("./profile"));

var appsFns = _interopRequireWildcard(require("./apps"));

var _asserts = require("./utils/asserts");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Identity {
  constructor(descriptor, storage, orbitdb, devices, backup, profile, apps) {
    _descriptor.set(this, {
      writable: true,
      value: void 0
    });

    _storage.set(this, {
      writable: true,
      value: void 0
    });

    _orbitdb.set(this, {
      writable: true,
      value: void 0
    });

    _devices.set(this, {
      writable: true,
      value: void 0
    });

    _backup.set(this, {
      writable: true,
      value: void 0
    });

    _profile.set(this, {
      writable: true,
      value: void 0
    });

    _apps.set(this, {
      writable: true,
      value: void 0
    });

    _signer.set(this, {
      writable: true,
      value: void 0
    });

    _onRevoke.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _createSigner.set(this, {
      writable: true,
      value: () => {
        const {
          didPublicKeyId,
          keyMaterial
        } = _classPrivateFieldGet(this, _devices).getCurrent();

        const didUrl = (0, _did.formatDid)({
          did: this.getDid(),
          fragment: didPublicKeyId
        });
        return (0, _idmSignatures.createSigner)(didUrl, keyMaterial.privateKeyPem);
      }
    });

    _handleDevicesCurrentRevoke.set(this, {
      writable: true,
      value: async () => {
        const key = (0, _storageKeys.getDescriptorKey)(_classPrivateFieldGet(this, _descriptor).id);
        _classPrivateFieldGet(this, _descriptor).revoked = true;

        try {
          await _classPrivateFieldGet(this, _storage).set(key, _classPrivateFieldGet(this, _descriptor), {
            encrypt: true
          });
        } catch (err) {
          console.warn(`Unable to mark identity as revoked: ${_classPrivateFieldGet(this, _descriptor).id}`, err);
        } // Stop replication


        try {
          await (0, _orbitdb2.stopOrbitDbReplication)(_classPrivateFieldGet(this, _orbitdb));
        } catch (err) {
          console.warn(`Unable to stop OrbitDB replication after identity has been revoked: ${_classPrivateFieldGet(this, _descriptor).id}`, err);
        }

        _classPrivateFieldGet(this, _onRevoke).dispatch();
      }
    });

    _classPrivateFieldSet(this, _descriptor, descriptor);

    _classPrivateFieldSet(this, _storage, storage);

    _classPrivateFieldSet(this, _orbitdb, orbitdb);

    _classPrivateFieldSet(this, _backup, backup);

    _classPrivateFieldSet(this, _devices, devices);

    _classPrivateFieldSet(this, _profile, profile);

    _classPrivateFieldSet(this, _apps, apps);

    _classPrivateFieldGet(this, _devices).onCurrentRevoke(_classPrivateFieldGet(this, _handleDevicesCurrentRevoke));

    if (_classPrivateFieldGet(this, _devices).getCurrent().revokedAt && !this.isRevoked()) {
      setTimeout(_classPrivateFieldGet(this, _handleDevicesCurrentRevoke), 10);
    }
  }

  get backup() {
    return _classPrivateFieldGet(this, _backup);
  }

  get devices() {
    return _classPrivateFieldGet(this, _devices);
  }

  get profile() {
    return _classPrivateFieldGet(this, _profile);
  }

  get apps() {
    return _classPrivateFieldGet(this, _apps);
  }

  getId() {
    return _classPrivateFieldGet(this, _descriptor).id;
  }

  getDid() {
    return _classPrivateFieldGet(this, _descriptor).did;
  }

  getAddedAt() {
    return _classPrivateFieldGet(this, _descriptor).addedAt;
  }

  isRevoked() {
    return _classPrivateFieldGet(this, _descriptor).revoked;
  }

  onRevoke(fn) {
    return _classPrivateFieldGet(this, _onRevoke).add(fn);
  }

  getSigner() {
    if (this.isRevoked()) {
      throw new _errors.IdentityRevokedError(`Unable to create signer for revoked identity: ${this.getIdentityId()}`);
    }

    if (!_classPrivateFieldGet(this, _signer)) {
      _classPrivateFieldSet(this, _signer, _classPrivateFieldGet(this, _createSigner).call(this));
    }

    return _classPrivateFieldGet(this, _signer);
  }

}

var _descriptor = new WeakMap();

var _storage = new WeakMap();

var _orbitdb = new WeakMap();

var _devices = new WeakMap();

var _backup = new WeakMap();

var _profile = new WeakMap();

var _apps = new WeakMap();

var _signer = new WeakMap();

var _onRevoke = new WeakMap();

var _createSigner = new WeakMap();

var _handleDevicesCurrentRevoke = new WeakMap();

const peekProfileDetails = async (did, ipfs) => {
  const id = await (0, _crypto.hashSha256)(did, true);
  const descriptor = {
    id,
    did,
    addedAt: Date.now(),
    revoked: false
  };
  const orbitdb = await (0, _orbitdb2.getOrbitDb)(id, ipfs);
  return profileFns.peekProfileDetails(descriptor, ipfs, orbitdb);
};

exports.peekProfileDetails = peekProfileDetails;

const createIdentity = async ({
  did,
  currentDevice,
  backupData,
  profileDetails
}, storage, didm, ipfs) => {
  const id = await (0, _crypto.hashSha256)(did, true);
  const descriptor = {
    id,
    did,
    addedAt: Date.now(),
    revoked: false
  };
  const orbitdb = await (0, _orbitdb2.getOrbitDb)(id, ipfs);

  try {
    await storage.set((0, _storageKeys.getDescriptorKey)(id), descriptor, {
      encrypt: true
    });
    const backup = await backupFns.createBackup(backupData, descriptor, storage);
    const profile = await profileFns.createProfile(profileDetails, descriptor, ipfs, orbitdb);
    const devices = await devicesFns.createDevices(currentDevice, descriptor, didm, storage, orbitdb);
    const apps = await appsFns.createApps(currentDevice.id, descriptor, orbitdb);
    return new Identity(descriptor, storage, orbitdb, devices, backup, profile, apps);
  } catch (err) {
    await removeIdentity(id, storage, orbitdb);
    throw err;
  }
};

exports.createIdentity = createIdentity;

const removeIdentity = async (id, storage, ipfs) => {
  const descriptorKey = (0, _storageKeys.getDescriptorKey)(id);
  const descriptor = await storage.get(descriptorKey);

  if (!descriptor) {
    return;
  }

  await storage.remove(descriptorKey);
  const orbitdb = await (0, _orbitdb2.getOrbitDb)(descriptor.id, ipfs, {
    replicate: false
  });
  await devicesFns.removeDevices(descriptor, storage, orbitdb);
  await profileFns.removeProfile(descriptor, ipfs, orbitdb);
  await backupFns.removeBackup(descriptor, storage);
  await appsFns.removeApps(descriptor, orbitdb);
  await (0, _orbitdb2.dropOrbitDb)(orbitdb);
};

exports.removeIdentity = removeIdentity;

const loadIdentities = async (storage, didm, ipfs) => {
  const descriptors = await storage.list({
    gte: _storageKeys.DESCRIPTOR_KEY_PREFIX,
    lte: `${_storageKeys.DESCRIPTOR_KEY_PREFIX}\xFF`,
    keys: false
  });
  return (0, _pReduce.default)(descriptors, async (acc, descriptor) => {
    const orbitdb = await (0, _orbitdb2.getOrbitDb)(descriptor.id, ipfs, {
      replicate: !descriptor.revoked
    });
    const backup = await backupFns.restoreBackup(descriptor, storage);
    const profile = await profileFns.restoreProfile(descriptor, ipfs, orbitdb);
    const devices = await devicesFns.restoreDevices(descriptor, didm, storage, orbitdb);
    const apps = await appsFns.createApps(devices.getCurrent().id, descriptor, orbitdb);
    const identity = new Identity(descriptor, storage, orbitdb, devices, backup, profile, apps);
    return Object.assign(acc, {
      [descriptor.id]: identity
    });
  }, {});
};

exports.loadIdentities = loadIdentities;