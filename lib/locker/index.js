"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _locks2 = _interopRequireDefault(require("./locks"));

var _idleTimer2 = _interopRequireDefault(require("./idle-timer"));

var _errors = require("../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Locker {
  constructor(storage, secret, locks, masterLock, idleTimer) {
    _storage.set(this, {
      writable: true,
      value: void 0
    });

    _secret.set(this, {
      writable: true,
      value: void 0
    });

    _locks.set(this, {
      writable: true,
      value: void 0
    });

    _masterLock.set(this, {
      writable: true,
      value: void 0
    });

    _idleTimer.set(this, {
      writable: true,
      value: void 0
    });

    _pristine.set(this, {
      writable: true,
      value: void 0
    });

    _onLockedChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _handleIdleTimerTimeout.set(this, {
      writable: true,
      value: () => {
        if (!_classPrivateFieldGet(this, _pristine)) {
          this.lock();
        }
      }
    });

    _handleSecretDefinedChange.set(this, {
      writable: true,
      value: () => {
        const locked = this.isLocked();

        if (!locked) {
          _classPrivateFieldGet(this, _idleTimer).restart();
        }

        _classPrivateFieldGet(this, _onLockedChange).dispatch(locked);
      }
    });

    _handleMasterLockEnabledChange.set(this, {
      writable: true,
      value: enabled => {
        _classPrivateFieldSet(this, _pristine, !enabled);

        if (enabled) {
          _classPrivateFieldGet(this, _idleTimer).restart();
        }
      }
    });

    _classPrivateFieldSet(this, _storage, storage);

    _classPrivateFieldSet(this, _secret, secret);

    _classPrivateFieldSet(this, _locks, locks);

    _classPrivateFieldSet(this, _masterLock, masterLock);

    _classPrivateFieldSet(this, _idleTimer, idleTimer);

    _classPrivateFieldSet(this, _pristine, !_classPrivateFieldGet(this, _masterLock).isEnabled());

    if (!_classPrivateFieldGet(this, _pristine)) {
      _classPrivateFieldGet(this, _idleTimer).restart();
    } else {
      _classPrivateFieldGet(this, _secret).generate();
    }

    _classPrivateFieldGet(this, _idleTimer).onTimeout(_classPrivateFieldGet(this, _handleIdleTimerTimeout));

    _classPrivateFieldGet(this, _masterLock).onEnabledChange(_classPrivateFieldGet(this, _handleMasterLockEnabledChange));

    _classPrivateFieldGet(this, _secret).onDefinedChange(_classPrivateFieldGet(this, _handleSecretDefinedChange));
  }

  get idleTimer() {
    return _classPrivateFieldGet(this, _idleTimer);
  }

  get masterLock() {
    return _classPrivateFieldGet(this, _masterLock);
  }

  isPristine() {
    return _classPrivateFieldGet(this, _pristine);
  }

  isLocked() {
    return !_classPrivateFieldGet(this, _secret).has();
  }

  getSecret() {
    return _classPrivateFieldGet(this, _secret).get();
  }

  listLockTypes() {
    return Object.keys(_classPrivateFieldGet(this, _locks));
  }

  getLock(type) {
    const lock = _classPrivateFieldGet(this, _locks)[type];

    if (!lock) {
      throw new _errors.UnknownLockTypeError(type);
    }

    return lock;
  }

  lock() {
    if (_classPrivateFieldGet(this, _pristine)) {
      throw new _errors.PristineError();
    }

    _classPrivateFieldGet(this, _secret).unset();
  }

  onLockedChange(fn) {
    return _classPrivateFieldGet(this, _onLockedChange).add(fn);
  }

}

var _storage = new WeakMap();

var _secret = new WeakMap();

var _locks = new WeakMap();

var _masterLock = new WeakMap();

var _idleTimer = new WeakMap();

var _pristine = new WeakMap();

var _onLockedChange = new WeakMap();

var _handleIdleTimerTimeout = new WeakMap();

var _handleSecretDefinedChange = new WeakMap();

var _handleMasterLockEnabledChange = new WeakMap();

const createLocker = async (storage, secret, masterLockType = 'passphrase') => {
  const idleTimer = await (0, _idleTimer2.default)(storage);
  const locks = await (0, _locks2.default)(storage, secret, masterLockType);
  const masterLock = locks[masterLockType];

  if (!masterLock) {
    throw new _errors.UnknownLockTypeError(masterLockType);
  }

  return new Locker(storage, secret, locks, masterLock, idleTimer);
};

var _default = createLocker;
exports.default = _default;
module.exports = exports.default;