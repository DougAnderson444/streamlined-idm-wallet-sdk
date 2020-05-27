"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _level = _interopRequireDefault(require("level"));

var _pify = _interopRequireDefault(require("pify"));

var _pMap = _interopRequireDefault(require("p-map"));

var _crypto = require("../utils/crypto");

var _errors = require("../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const createLevelDb = (0, _pify.default)(_level.default);
const DB_NAME = 'idm-wallet-db';

class Storage {
  constructor(db, _secret2) {
    _db.set(this, {
      writable: true,
      value: void 0
    });

    _secret.set(this, {
      writable: true,
      value: void 0
    });

    _readStream.set(this, {
      writable: true,
      value: async options => {
        options = {
          keys: true,
          values: true,
          ...options
        };
        const result = await new Promise((resolve, reject) => {
          const result = [];

          _classPrivateFieldGet(this, _db).createReadStream(options).on('data', data => result.push(data)).on('end', () => resolve(result)).on('error', reject);
        });
        const finalResult = await (0, _pMap.default)(result, async data => {
          if (options.values) {
            if (options.keys) {
              data.value = await _classPrivateFieldGet(this, _maybeDecrypt).call(this, data.value);
              data.value = JSON.parse(data.value);
            } else {
              data = await _classPrivateFieldGet(this, _maybeDecrypt).call(this, data);
              data = JSON.parse(data);
            }
          }

          return data;
        });
        return finalResult;
      }
    });

    _encrypt.set(this, {
      writable: true,
      value: async (value, key) => {
        const valueUint8Array = new TextEncoder().encode(value);
        const encryptedValue = await (0, _crypto.encrypt)(valueUint8Array, key, true);
        return JSON.stringify(encryptedValue);
      }
    });

    _decrypt.set(this, {
      writable: true,
      value: async (encryptedValue, key) => {
        const decryptedValueUint8Array = await (0, _crypto.decrypt)(encryptedValue, key);
        const decryptedValue = new TextDecoder().decode(decryptedValueUint8Array);
        return decryptedValue;
      }
    });

    _maybeDecrypt.set(this, {
      writable: true,
      value: async value => {
        const decodedValue = JSON.parse(value);

        if (!(0, _crypto.isEncrypted)(decodedValue)) {
          return value;
        }

        const secret = await _classPrivateFieldGet(this, _secret).getAsync();
        const decryptedValue = await _classPrivateFieldGet(this, _decrypt).call(this, decodedValue, secret);
        return decryptedValue;
      }
    });

    _classPrivateFieldSet(this, _db, db);

    _classPrivateFieldSet(this, _secret, _secret2);
  }

  async has(key) {
    let value;

    try {
      value = await _classPrivateFieldGet(this, _db).get(key);
    } catch (err) {
      if (err.type === 'NotFoundError') {
        return false;
      }

      throw err;
    }

    return value != null;
  }

  async get(key) {
    try {
      let value = await _classPrivateFieldGet(this, _db).get(key);
      value = await _classPrivateFieldGet(this, _maybeDecrypt).call(this, value);
      return JSON.parse(value);
    } catch (err) {
      if (err.type === 'NotFoundError') {
        return undefined;
      }

      throw new _errors.StorageError(err.message, 'get', err.type);
    }
  }

  async set(key, value, options) {
    const {
      encrypt
    } = { ...options
    };

    try {
      value = JSON.stringify(value);

      if (encrypt) {
        const secret = await _classPrivateFieldGet(this, _secret).getAsync();
        value = await _classPrivateFieldGet(this, _encrypt).call(this, value, secret);
      }

      await _classPrivateFieldGet(this, _db).put(key, value);
    } catch (err) {
      throw new _errors.StorageError(err.message, 'set', err.type);
    }
  }

  async remove(key) {
    try {
      await _classPrivateFieldGet(this, _db).del(key);
    } catch (err) {
      throw new _errors.StorageError(err.message, 'remove', err.type);
    }
  }

  async clear() {
    try {
      const keys = await _classPrivateFieldGet(this, _readStream).call(this, {
        values: false
      });
      const ops = keys.map(key => ({
        type: 'del',
        key
      }));
      await _classPrivateFieldGet(this, _db).batch(ops);
    } catch (err) {
      throw new _errors.StorageError(err.message, 'clear', err.type);
    }
  }

  async list(options) {
    try {
      const result = await _classPrivateFieldGet(this, _readStream).call(this, options);
      return result;
    } catch (err) {
      throw new _errors.StorageError(err.message, 'list', err.type);
    }
  }

}

var _db = new WeakMap();

var _secret = new WeakMap();

var _readStream = new WeakMap();

var _encrypt = new WeakMap();

var _decrypt = new WeakMap();

var _maybeDecrypt = new WeakMap();

const createStorage = async secret => {
  const db = await createLevelDb(DB_NAME, {});
  return new Storage(db, secret);
};

var _default = createStorage;
exports.default = _default;
module.exports = exports.default;