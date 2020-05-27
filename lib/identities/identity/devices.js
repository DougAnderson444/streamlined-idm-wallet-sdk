"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeDevices = exports.restoreDevices = exports.createDevices = exports.generateCurrentDevice = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _merge2 = _interopRequireDefault(require("lodash/merge"));

var _pick2 = _interopRequireDefault(require("lodash/pick"));

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _orbitdb = require("./utils/orbitdb");

var _asserts = require("./utils/asserts");

var _errors = require("../../utils/errors");

var _crypto = require("../../utils/crypto");

var _storageKeys = require("./utils/storage-keys");

var _devices = require("./utils/constants/devices");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Devices {
  constructor(currentDeviceDescriptor, identityDescriptor, didm, orbitdbStore) {
    _currentDeviceDescriptor.set(this, {
      writable: true,
      value: void 0
    });

    _identityDescriptor.set(this, {
      writable: true,
      value: void 0
    });

    _didm.set(this, {
      writable: true,
      value: void 0
    });

    _orbitdbStore.set(this, {
      writable: true,
      value: void 0
    });

    _devicesMap.set(this, {
      writable: true,
      value: void 0
    });

    _devicesList.set(this, {
      writable: true,
      value: void 0
    });

    _onChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _onCurrentRevoke.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _updateDevices.set(this, {
      writable: true,
      value: () => {
        const currentId = _classPrivateFieldGet(this, _currentDeviceDescriptor).id;

        _classPrivateFieldSet(this, _devicesMap, { ..._classPrivateFieldGet(this, _orbitdbStore).all
        });

        if (_classPrivateFieldGet(this, _devicesMap)[currentId]) {
          _classPrivateFieldGet(this, _devicesMap)[currentId] = (0, _merge2.default)({ ..._classPrivateFieldGet(this, _devicesMap)[currentId]
          }, (0, _pick2.default)(_classPrivateFieldGet(this, _currentDeviceDescriptor), _devices.DESCRIPTOR_SENSITIVE_KEYS));
        }

        _classPrivateFieldSet(this, _devicesList, Object.values(_classPrivateFieldGet(this, _devicesMap)));

        _classPrivateFieldGet(this, _devicesList).sort((device1, device2) => device2.createdAt - device1.createdAt);

        _classPrivateFieldGet(this, _onChange).dispatch(_classPrivateFieldGet(this, _devicesList));
      }
    });

    _handleOrbitdbStoreChange.set(this, {
      writable: true,
      value: () => {
        const isCurrentDeviceRevoked = _classPrivateFieldGet(this, _isCurrentDeviceRevoked).call(this);

        _classPrivateFieldGet(this, _updateDevices).call(this);

        if (!isCurrentDeviceRevoked && _classPrivateFieldGet(this, _isCurrentDeviceRevoked).call(this)) {
          _classPrivateFieldGet(this, _onCurrentRevoke).dispatch();
        }
      }
    });

    _isCurrentDeviceRevoked.set(this, {
      writable: true,
      value: () => {
        const {
          id
        } = _classPrivateFieldGet(this, _currentDeviceDescriptor);

        return !_classPrivateFieldGet(this, _devicesMap)[id] || !!_classPrivateFieldGet(this, _devicesMap)[id].revokedAt;
      }
    });

    _classPrivateFieldSet(this, _currentDeviceDescriptor, currentDeviceDescriptor);

    _classPrivateFieldSet(this, _identityDescriptor, identityDescriptor);

    _classPrivateFieldSet(this, _didm, didm);

    _classPrivateFieldSet(this, _orbitdbStore, orbitdbStore);

    _classPrivateFieldGet(this, _orbitdbStore).events.on('write', _classPrivateFieldGet(this, _handleOrbitdbStoreChange));

    _classPrivateFieldGet(this, _orbitdbStore).events.on('replicated', _classPrivateFieldGet(this, _handleOrbitdbStoreChange));

    _classPrivateFieldGet(this, _updateDevices).call(this);
  }

  list() {
    return _classPrivateFieldGet(this, _devicesList);
  }

  getCurrent() {
    return this.get(_classPrivateFieldGet(this, _currentDeviceDescriptor).id);
  }

  has(id) {
    return Boolean(_classPrivateFieldGet(this, _devicesMap)[id]);
  }

  get(id) {
    const device = _classPrivateFieldGet(this, _devicesMap)[id];

    if (!device) {
      throw new _errors.UnknownDeviceError(id);
    }

    return device;
  }

  async revoke(id, params) {
    const device = _classPrivateFieldGet(this, _devicesMap)[id];

    if (!device) {
      throw new _errors.UnknownDeviceError(id);
    }

    if (id === _classPrivateFieldGet(this, _currentDeviceDescriptor).id) {
      throw new _errors.InvalidDeviceOperationError('Revoking own device is not allowed');
    }

    if (!device.revokedAt) {
      // Remove device from DID Document and only then remove it from orbitdb
      await _classPrivateFieldGet(this, _didm).update(_classPrivateFieldGet(this, _identityDescriptor).did, params, document => {
        document.revokePublicKey(device.didPublicKeyId);
      });
      await _classPrivateFieldGet(this, _orbitdbStore).put(id, { ...device,
        revokedAt: Date.now()
      });
    }
  }

  async updateInfo(id, deviceInfo) {
    (0, _asserts.assertDeviceInfo)(deviceInfo);

    const device = _classPrivateFieldGet(this, _devicesMap)[id];

    if (!device) {
      throw new _errors.UnknownDeviceError(id);
    }

    const storedDeviceInfo = (0, _pick2.default)(device, Object.keys(deviceInfo));

    if (!(0, _isEqual2.default)(deviceInfo, storedDeviceInfo)) {
      await _classPrivateFieldGet(this, _orbitdbStore).put(id, { ...device,
        updatedAt: Date.now(),
        ...deviceInfo
      });
    }
  }

  onChange(fn) {
    return _classPrivateFieldGet(this, _onChange).add(fn);
  }

  onCurrentRevoke(fn) {
    return _classPrivateFieldGet(this, _onCurrentRevoke).add(fn);
  }

}

var _currentDeviceDescriptor = new WeakMap();

var _identityDescriptor = new WeakMap();

var _didm = new WeakMap();

var _orbitdbStore = new WeakMap();

var _devicesMap = new WeakMap();

var _devicesList = new WeakMap();

var _onChange = new WeakMap();

var _onCurrentRevoke = new WeakMap();

var _updateDevices = new WeakMap();

var _handleOrbitdbStoreChange = new WeakMap();

var _isCurrentDeviceRevoked = new WeakMap();

const generateCurrentDevice = async deviceInfo => {
  const keyMaterial = await (0, _crypto.generateDeviceKeyMaterial)();
  const id = await (0, _crypto.hashSha256)(keyMaterial.publicKeyPem, true);
  const currentDevice = {
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    revokedAt: null,
    didPublicKeyId: `${_devices.DID_PUBLIC_KEY_PREFIX}${id}`,
    keyMaterial,
    ...deviceInfo
  };
  const didPublicKey = {
    id: currentDevice.didPublicKeyId,
    type: 'EdDsaSAPublicKeySecp256k1',
    publicKeyPem: keyMaterial.publicKeyPem,
    publicExtendedKeyBase58: keyMaterial.publicExtendedKeyBase58
  };
  return {
    currentDevice,
    didPublicKey
  };
};

exports.generateCurrentDevice = generateCurrentDevice;

const createDevices = async (currentDevice, identityDescriptor, didm, storage, orbitdb) => {
  const currentDeviceWithoutSensitiveKeys = (0, _omit2.default)(currentDevice, _devices.DESCRIPTOR_SENSITIVE_KEYS);
  const currentDeviceDescriptor = (0, _pick2.default)(currentDevice, ['id', ..._devices.DESCRIPTOR_SENSITIVE_KEYS]);
  const orbitdbStore = await (0, _orbitdb.loadStore)(orbitdb, _devices.ORBITDB_STORE_NAME, _devices.ORBITDB_STORE_TYPE);
  await storage.set((0, _storageKeys.getCurrentDeviceKey)(identityDescriptor.id), currentDeviceDescriptor, {
    encrypt: true
  });
  await orbitdbStore.put(currentDeviceDescriptor.id, currentDeviceWithoutSensitiveKeys);
  return new Devices(currentDevice, identityDescriptor, didm, orbitdbStore);
};

exports.createDevices = createDevices;

const restoreDevices = async (identityDescriptor, didm, storage, orbitdb) => {
  const currentDeviceDescriptor = await storage.get((0, _storageKeys.getCurrentDeviceKey)(identityDescriptor.id));
  const orbitdbStore = await (0, _orbitdb.loadStore)(orbitdb, _devices.ORBITDB_STORE_NAME, _devices.ORBITDB_STORE_TYPE);
  return new Devices(currentDeviceDescriptor, identityDescriptor, didm, orbitdbStore);
};

exports.restoreDevices = restoreDevices;

const removeDevices = async (identityDescriptor, storage, orbitdb) => {
  await storage.remove((0, _storageKeys.getCurrentDeviceKey)(identityDescriptor.id));
  await (0, _orbitdb.dropStore)(orbitdb, _devices.ORBITDB_STORE_NAME, _devices.ORBITDB_STORE_TYPE);
};

exports.removeDevices = removeDevices;