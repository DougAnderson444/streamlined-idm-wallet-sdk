"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _pDefer = _interopRequireDefault(require("p-defer"));

var _crypto = require("../utils/crypto");

var _errors = require("../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Secret {
  constructor(undefinedError) {
    _secret.set(this, {
      writable: true,
      value: void 0
    });

    _undefinedError.set(this, {
      writable: true,
      value: void 0
    });

    _semaphore.set(this, {
      writable: true,
      value: (0, _pDefer.default)()
    });

    _onDefinedChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _classPrivateFieldSet(this, _undefinedError, undefinedError || new _errors.LockerLockedError());
  }

  has() {
    return _classPrivateFieldGet(this, _secret) != null;
  }

  get() {
    if (!_classPrivateFieldGet(this, _secret)) {
      throw _classPrivateFieldGet(this, _undefinedError);
    }

    return _classPrivateFieldGet(this, _secret);
  }

  async getAsync() {
    await _classPrivateFieldGet(this, _semaphore).promise;
    return _classPrivateFieldGet(this, _secret);
  }

  set(secret) {
    const wasUndefined = !this.has();

    _classPrivateFieldSet(this, _secret, secret);

    _classPrivateFieldGet(this, _semaphore).resolve();

    wasUndefined && _classPrivateFieldGet(this, _onDefinedChange).dispatch(_classPrivateFieldGet(this, _secret));
  }

  unset() {
    if (!this.has()) {
      return;
    }

    _classPrivateFieldSet(this, _secret, null);

    _classPrivateFieldSet(this, _semaphore, (0, _pDefer.default)());

    _classPrivateFieldGet(this, _onDefinedChange).dispatch(_classPrivateFieldGet(this, _secret));
  }

  generate() {
    this.set((0, _crypto.generateCypherKey)());
  }

  onDefinedChange(fn) {
    return _classPrivateFieldGet(this, _onDefinedChange).add(fn);
  }

}

var _secret = new WeakMap();

var _undefinedError = new WeakMap();

var _semaphore = new WeakMap();

var _onDefinedChange = new WeakMap();

const createSecret = undefinedError => new Secret(undefinedError);

var _default = createSecret;
exports.default = _default;
module.exports = exports.default;