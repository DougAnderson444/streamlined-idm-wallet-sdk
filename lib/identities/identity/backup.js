"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeBackup = exports.restoreBackup = exports.createBackup = void 0;

var _hexArray = _interopRequireDefault(require("hex-array"));

var _storageKeys = require("./utils/storage-keys");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Backup {
  constructor(data, identityDescriptor, storage) {
    _data.set(this, {
      writable: true,
      value: void 0
    });

    _identityDescriptor.set(this, {
      writable: true,
      value: void 0
    });

    _storage.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _data, data);

    _classPrivateFieldSet(this, _identityDescriptor, identityDescriptor);

    _classPrivateFieldSet(this, _storage, storage);
  }

  isComplete() {
    return !_classPrivateFieldGet(this, _data);
  }

  getData() {
    return _classPrivateFieldGet(this, _data);
  }

  async setComplete() {
    if (this.isComplete()) {
      return;
    }

    await _classPrivateFieldGet(this, _storage).remove((0, _storageKeys.getBackupKey)(_classPrivateFieldGet(this, _identityDescriptor).id));

    _classPrivateFieldSet(this, _data, undefined);
  }

}

var _data = new WeakMap();

var _identityDescriptor = new WeakMap();

var _storage = new WeakMap();

const createBackup = async (data, identityDescriptor, storage) => {
  if (data) {
    const serializedData = { ...data,
      seed: _hexArray.default.toString(data.seed, {
        uppercase: false
      })
    };
    await storage.set((0, _storageKeys.getBackupKey)(identityDescriptor.id), serializedData, {
      encrypt: true
    });
  }

  return new Backup(data, identityDescriptor, storage);
};

exports.createBackup = createBackup;

const restoreBackup = async (identityDescriptor, storage) => {
  const serializedData = await storage.get((0, _storageKeys.getBackupKey)(identityDescriptor.id));
  const data = serializedData && { ...serializedData,
    seed: _hexArray.default.fromString(serializedData.seed)
  };
  return new Backup(data, identityDescriptor, storage);
};

exports.restoreBackup = restoreBackup;

const removeBackup = async (identityDescriptor, storage) => {
  storage.remove((0, _storageKeys.getBackupKey)(identityDescriptor.id));
};

exports.removeBackup = removeBackup;