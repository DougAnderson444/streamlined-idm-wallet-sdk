"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scryptAsync = _interopRequireDefault(require("scrypt-async"));

var _hexArray = _interopRequireDefault(require("hex-array"));

var _pify = _interopRequireDefault(require("pify"));

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _passphraseStrength = _interopRequireDefault(require("./utils/passphrase-strength"));

var _asserts = require("./utils/asserts");

var _crypto = require("../../utils/crypto");

var _errors = require("../../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const pScrypt = (0, _pify.default)(_scryptAsync.default, {
  errorFirst: false
});
const STORAGE_KEY = 'locker.lock.passphrase';

class PassphraseLock {
  constructor(storage, _secret2, masterLockType, _enabled2) {
    _storage.set(this, {
      writable: true,
      value: void 0
    });

    _secret.set(this, {
      writable: true,
      value: void 0
    });

    _master.set(this, {
      writable: true,
      value: void 0
    });

    _enabled.set(this, {
      writable: true,
      value: void 0
    });

    _onEnabledChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _configure.set(this, {
      writable: true,
      value: async passphrase => {
        const secret = await _classPrivateFieldGet(this, _secret).getAsync(); // Derive a 256-bit key from the passphrase which will be used as the encryption key
        // Then, encrypt the locker secret with that derived key using AES-GCM

        const {
          key,
          keyDerivation
        } = await _classPrivateFieldGet(this, _deriveKey).call(this, passphrase);
        const encryptedSecret = await (0, _crypto.encrypt)(secret, key, true); // Finally store everything that we need to validate the passphrase in the future

        await _classPrivateFieldGet(this, _storage).set(STORAGE_KEY, {
          keyDerivation,
          encryptedSecret
        });
      }
    });

    _deriveKey.set(this, {
      writable: true,
      value: async passphrase => {
        // Salt defaults to 128 bits which is more than enough
        const salt = (0, _crypto.getRandomBytes)(128 / 8); // Params recommended for interactive logins in 2017

        const params = {
          N: 32768,
          r: 8,
          p: 1
        };
        const password = new TextEncoder().encode(passphrase);
        const key = await pScrypt(password, salt, { ...params,
          dkLen: 32,
          // 256 bits
          encoding: 'binary'
        });
        return {
          key,
          keyDerivation: {
            algorithm: 'scrypt',
            salt: _hexArray.default.toString(salt, {
              uppercase: false
            }),
            params
          }
        };
      }
    });

    _rederiveKey.set(this, {
      writable: true,
      value: async (passphrase, keyDerivation) => {
        const salt = _hexArray.default.fromString(keyDerivation.salt);

        const password = new TextEncoder().encode(passphrase);
        const key = await pScrypt(password, salt, { ...keyDerivation.params,
          encoding: 'binary'
        });
        return key;
      }
    });

    _dispatchEnabledChange.set(this, {
      writable: true,
      value: enabled => {
        _classPrivateFieldSet(this, _enabled, enabled);

        _classPrivateFieldGet(this, _onEnabledChange).dispatch(enabled);
      }
    });

    _classPrivateFieldSet(this, _storage, storage);

    _classPrivateFieldSet(this, _secret, _secret2);

    _classPrivateFieldSet(this, _master, masterLockType === this.getType());

    _classPrivateFieldSet(this, _enabled, !!_enabled2);
  }

  getType() {
    return 'passphrase';
  }

  isMaster() {
    return _classPrivateFieldGet(this, _master);
  }

  isEnabled() {
    return _classPrivateFieldGet(this, _enabled);
  }

  onEnabledChange(fn) {
    return _classPrivateFieldGet(this, _onEnabledChange).add(fn);
  }

  async enable(passphrase) {
    (0, _asserts.assertDisabled)(_classPrivateFieldGet(this, _enabled));
    await this.validate(passphrase);
    await _classPrivateFieldGet(this, _configure).call(this, passphrase);

    _classPrivateFieldGet(this, _dispatchEnabledChange).call(this, true);
  }

  async disable() {
    (0, _asserts.assertEnabled)(_classPrivateFieldGet(this, _enabled));
    (0, _asserts.assertNotMaster)(_classPrivateFieldGet(this, _master));
    await _classPrivateFieldGet(this, _storage).remove(STORAGE_KEY);

    _classPrivateFieldGet(this, _dispatchEnabledChange).call(this, false);
  }

  async validate(passphrase) {
    const result = (0, _passphraseStrength.default)(passphrase);

    if (result.score < 0.5) {
      throw new _errors.LockValidationError('Passphrase is too weak', result);
    }

    return result;
  }

  async update(newPassphrase, passphrase) {
    (0, _asserts.assertEnabled)(_classPrivateFieldGet(this, _enabled));
    await this.validate(newPassphrase); // Be sure that the user is able to unlock if this is the master lock

    if (_classPrivateFieldGet(this, _master)) {
      await this.unlock(passphrase);
    }

    await _classPrivateFieldGet(this, _configure).call(this, newPassphrase);
  }

  async unlock(input) {
    (0, _asserts.assertEnabled)(_classPrivateFieldGet(this, _enabled)); // Read the previous saved stuff from the storage

    const {
      keyDerivation,
      encryptedSecret
    } = await _classPrivateFieldGet(this, _storage).get(STORAGE_KEY); // Re-derive the key from the passphrase with the same salt and params
    // Then, decrypt the locker secret with that derived key using AES-GCM
    // Because AES-GCM is authenticated, it will fail if the key is wrong (invalid passphrase)

    const key = await _classPrivateFieldGet(this, _rederiveKey).call(this, input, keyDerivation);
    let secret;

    try {
      secret = await (0, _crypto.decrypt)(encryptedSecret, key);
    } catch (err) {
      throw new _errors.UnlockMismatchError('Passphrase is invalid');
    }

    _classPrivateFieldGet(this, _secret).set(secret);
  }

}

var _storage = new WeakMap();

var _secret = new WeakMap();

var _master = new WeakMap();

var _enabled = new WeakMap();

var _onEnabledChange = new WeakMap();

var _configure = new WeakMap();

var _deriveKey = new WeakMap();

var _rederiveKey = new WeakMap();

var _dispatchEnabledChange = new WeakMap();

const createPassphraseLock = async (storage, secret, masterLockType) => {
  const enabled = await storage.has(STORAGE_KEY);
  return new PassphraseLock(storage, secret, masterLockType, enabled);
};

var _default = createPassphraseLock;
exports.default = _default;
module.exports = exports.default;