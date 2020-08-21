"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "assertApp", {
  enumerable: true,
  get: function () {
    return identityFns.assertApp;
  }
});
exports.default = void 0;

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _did = require("../utils/did");

var _errors = require("../utils/errors");

var identityFns = _interopRequireWildcard(require("./identity"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Identities {
  constructor(storage, didm, ipfs) {
    _storage.set(this, {
      writable: true,
      value: void 0
    });

    _didm.set(this, {
      writable: true,
      value: void 0
    });

    _ipfs.set(this, {
      writable: true,
      value: void 0
    });

    _identitiesList.set(this, {
      writable: true,
      value: void 0
    });

    _identitiesMap.set(this, {
      writable: true,
      value: void 0
    });

    _identitiesLoad.set(this, {
      writable: true,
      value: void 0
    });

    _onChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _onLoad.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _getIdentityByDid.set(this, {
      writable: true,
      value: did => _classPrivateFieldGet(this, _identitiesList).find(identity => identity.getDid() === did)
    });

    _assertDidmSupport.set(this, {
      writable: true,
      value: (didMethod, ...purposes) => {
        purposes.forEach(purpose => {
          if (!_classPrivateFieldGet(this, _didm).isSupported(didMethod, purpose)) {
            throw new _errors.UnsupportedDidMethodPurposeError(didMethod, purpose);
          }
        });
      }
    });

    _buildIdentitiesList.set(this, {
      writable: true,
      value: () => {
        _classPrivateFieldSet(this, _identitiesList, Object.values(_classPrivateFieldGet(this, _identitiesMap)));

        _classPrivateFieldGet(this, _identitiesList).sort((identity1, identity2) => identity1.getAddedAt() - identity2.getAddedAt());
      }
    });

    _updateIdentitiesList.set(this, {
      writable: true,
      value: operation => {
        _classPrivateFieldGet(this, _buildIdentitiesList).call(this);

        _classPrivateFieldGet(this, _onChange).dispatch(_classPrivateFieldGet(this, _identitiesList), operation);
      }
    });

    _classPrivateFieldSet(this, _storage, storage);

    _classPrivateFieldSet(this, _didm, didm);

    _classPrivateFieldSet(this, _ipfs, ipfs);
  }

  isLoaded() {
    return !!_classPrivateFieldGet(this, _identitiesMap);
  }

  async load() {
    let cleanLoad = false;

    if (!_classPrivateFieldGet(this, _identitiesLoad)) {
      _classPrivateFieldSet(this, _identitiesLoad, identityFns.loadIdentities(_classPrivateFieldGet(this, _storage), _classPrivateFieldGet(this, _didm), _classPrivateFieldGet(this, _ipfs)));

      cleanLoad = !this.isLoaded();
    }

    try {
      _classPrivateFieldSet(this, _identitiesMap, await _classPrivateFieldGet(this, _identitiesLoad));
    } catch (err) {
      _classPrivateFieldSet(this, _identitiesLoad, undefined);

      throw err;
    }

    _classPrivateFieldGet(this, _buildIdentitiesList).call(this);

    if (cleanLoad) {
      _classPrivateFieldGet(this, _onLoad).dispatch(_classPrivateFieldGet(this, _identitiesList));
    }

    return _classPrivateFieldGet(this, _identitiesList);
  }

  has(id) {
    return Boolean(_classPrivateFieldGet(this, _identitiesMap)[id]);
  }

  get(id) {
    if (!_classPrivateFieldGet(this, _identitiesMap)) {
      throw new _errors.IdentitiesNotLoadedError();
    }

    if (!_classPrivateFieldGet(this, _identitiesMap)[id]) {
      throw new _errors.UnknownIdentityError(id);
    }

    return _classPrivateFieldGet(this, _identitiesMap)[id];
  }

  list() {
    if (!_classPrivateFieldGet(this, _identitiesMap)) {
      throw new _errors.IdentitiesNotLoadedError();
    }

    return _classPrivateFieldGet(this, _identitiesList);
  }

  async getDidDoc(didMethod, did) {
    _classPrivateFieldGet(this, _assertDidmSupport).call(this, didMethod, 'getDid', 'resolve');

    await this.load();
    const didDocument = await _classPrivateFieldGet(this, _didm).resolve(did);
    return didDocument;
  }

  async peek(didMethod, params) {
    _classPrivateFieldGet(this, _assertDidmSupport).call(this, didMethod, 'getDid', 'resolve');

    await this.load();
    const did = await _classPrivateFieldGet(this, _didm).getDid(didMethod, params);
    const didDocument = await _classPrivateFieldGet(this, _didm).resolve(did);

    const identity = _classPrivateFieldGet(this, _getIdentityByDid).call(this, did);

    const profileDetails = identity ? identity.profile.getDetails() : await identityFns.peekProfileDetails(did, _classPrivateFieldGet(this, _ipfs));
    return {
      did,
      didDocument,
      profileDetails
    };
  }

  async create(didMethod, params) {
    const {
      profileDetails,
      deviceInfo
    } = params || {};

    _classPrivateFieldGet(this, _assertDidmSupport).call(this, didMethod, 'create');

    identityFns.assertProfileDetails(profileDetails);
    identityFns.assertDeviceInfo(deviceInfo);
    await this.load();
    const {
      currentDevice,
      didPublicKey
    } = await identityFns.generateCurrentDevice(deviceInfo);
    const {
      did,
      didDocument,
      backupData
    } = await _classPrivateFieldGet(this, _didm).create(didMethod, params, document => {
      document.addPublicKey(didPublicKey);
      document.addAuthentication(didPublicKey.id);
    });
    const identity = await identityFns.createIdentity({
      did,
      currentDevice,
      backupData,
      profileDetails
    }, _classPrivateFieldGet(this, _storage), _classPrivateFieldGet(this, _didm), _classPrivateFieldGet(this, _ipfs));
    _classPrivateFieldGet(this, _identitiesMap)[identity.getId()] = identity;

    _classPrivateFieldGet(this, _updateIdentitiesList).call(this, {
      type: 'create',
      id: identity.getId()
    });

    return identity;
  }

  async addService(didMethod, params, serviceDetails) {
    const {
      id,
      type,
      serviceEndpoint
    } = serviceDetails || {};

    _classPrivateFieldGet(this, _assertDidmSupport).call(this, didMethod, 'update');

    await this.load();
    const did = await _classPrivateFieldGet(this, _didm).getDid(didMethod, params);
    return await _classPrivateFieldGet(this, _didm).update(did, params, document => {
      document.addService({
        id: id,
        // ie'data',
        type: type,
        //ie 'DataService',
        serviceEndpoint: serviceEndpoint // ie 'https://doug.peerpiper.io/',

      });
    });
  }

  async import(didMethod, params) {
    const {
      deviceInfo
    } = params || {};

    _classPrivateFieldGet(this, _assertDidmSupport).call(this, didMethod, 'getDid', 'update');

    identityFns.assertDeviceInfo(deviceInfo);
    await this.load();
    const did = await _classPrivateFieldGet(this, _didm).getDid(didMethod, params);

    if (_classPrivateFieldGet(this, _getIdentityByDid).call(this, did)) {
      throw new _errors.IdentityAlreadyExistsError(did);
    }

    const {
      currentDevice,
      didPublicKey
    } = await identityFns.generateCurrentDevice(deviceInfo);
    await _classPrivateFieldGet(this, _didm).update(did, params, document => {
      document.addPublicKey(didPublicKey);
      document.addAuthentication(didPublicKey.id);
    });
    const identity = await identityFns.createIdentity({
      did,
      currentDevice
    }, _classPrivateFieldGet(this, _storage), _classPrivateFieldGet(this, _didm), _classPrivateFieldGet(this, _ipfs));
    _classPrivateFieldGet(this, _identitiesMap)[identity.getId()] = identity;

    _classPrivateFieldGet(this, _updateIdentitiesList).call(this, {
      type: 'import',
      id: identity.getId()
    });

    return identity;
  }

  async remove(id, params) {
    await this.load();
    const identity = this.get(id);

    if (!identity.isRevoked()) {
      const did = identity.getDid();
      const didMethod = (0, _did.parseDid)(did).method;

      _classPrivateFieldGet(this, _assertDidmSupport).call(this, didMethod, 'update');

      await _classPrivateFieldGet(this, _didm).update(did, params, document => {
        document.revokePublicKey(identity.devices.getCurrent().didPublicKeyId);
      });
    }

    await identityFns.removeIdentity(id, _classPrivateFieldGet(this, _storage), _classPrivateFieldGet(this, _ipfs));
    delete _classPrivateFieldGet(this, _identitiesMap)[id];

    _classPrivateFieldGet(this, _updateIdentitiesList).call(this, {
      type: 'remove',
      id
    });
  }

  onChange(fn) {
    return _classPrivateFieldGet(this, _onChange).add(fn);
  }

  onLoad(fn) {
    return _classPrivateFieldGet(this, _onLoad).add(fn);
  }

}

var _storage = new WeakMap();

var _didm = new WeakMap();

var _ipfs = new WeakMap();

var _identitiesList = new WeakMap();

var _identitiesMap = new WeakMap();

var _identitiesLoad = new WeakMap();

var _onChange = new WeakMap();

var _onLoad = new WeakMap();

var _getIdentityByDid = new WeakMap();

var _assertDidmSupport = new WeakMap();

var _buildIdentitiesList = new WeakMap();

var _updateIdentitiesList = new WeakMap();

const createIdentities = (storage, didm, ipfs) => new Identities(storage, didm, ipfs);

var _default = createIdentities;
exports.default = _default;