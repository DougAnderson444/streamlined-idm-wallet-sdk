"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _picoSignals = _interopRequireDefault(require("pico-signals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const STORAGE_MAXTIME_KEY = 'locker.idle.maxTime';
const DEFAULT_MAX_TIME = 3 * 60 * 1000;

class IdleTimer {
  constructor(storage, maxTime) {
    _storage.set(this, {
      writable: true,
      value: void 0
    });

    _maxTime.set(this, {
      writable: true,
      value: void 0
    });

    _timeout.set(this, {
      writable: true,
      value: void 0
    });

    _timeoutTime.set(this, {
      writable: true,
      value: void 0
    });

    _restartTimestamp.set(this, {
      writable: true,
      value: 0
    });

    _onTimeout.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _handleTimeout.set(this, {
      writable: true,
      value: () => {
        _classPrivateFieldSet(this, _timeout, undefined);

        _classPrivateFieldSet(this, _timeoutTime, 0);

        _classPrivateFieldSet(this, _restartTimestamp, 0);

        _classPrivateFieldGet(this, _onTimeout).dispatch();
      }
    });

    _classPrivateFieldSet(this, _storage, storage);

    _classPrivateFieldSet(this, _maxTime, maxTime);
  }

  restart() {
    clearTimeout(_classPrivateFieldGet(this, _timeout));

    _classPrivateFieldSet(this, _timeoutTime, _classPrivateFieldGet(this, _maxTime));

    _classPrivateFieldSet(this, _timeout, setTimeout(_classPrivateFieldGet(this, _handleTimeout), _classPrivateFieldGet(this, _timeoutTime)));

    _classPrivateFieldSet(this, _restartTimestamp, Date.now());
  }

  getMaxTime() {
    return _classPrivateFieldGet(this, _maxTime);
  }

  getRemainingTime() {
    const remainingTime = _classPrivateFieldGet(this, _timeoutTime) - (Date.now() - _classPrivateFieldGet(this, _restartTimestamp));

    return remainingTime > 0 ? remainingTime : 0;
  }

  async setMaxTime(time) {
    const isSmaller = time < _classPrivateFieldGet(this, _maxTime);

    await _classPrivateFieldGet(this, _storage).set(STORAGE_MAXTIME_KEY, time);

    _classPrivateFieldSet(this, _maxTime, time);

    if (_classPrivateFieldGet(this, _timeout) && isSmaller) {
      this.restart();
    }
  }

  onTimeout(fn) {
    return _classPrivateFieldGet(this, _onTimeout).add(fn);
  }

}

var _storage = new WeakMap();

var _maxTime = new WeakMap();

var _timeout = new WeakMap();

var _timeoutTime = new WeakMap();

var _restartTimestamp = new WeakMap();

var _onTimeout = new WeakMap();

var _handleTimeout = new WeakMap();

const createIdleTimer = async storage => {
  const storageMaxTime = await storage.get(STORAGE_MAXTIME_KEY);
  const maxTime = storageMaxTime ? storageMaxTime : DEFAULT_MAX_TIME;
  return new IdleTimer(storage, maxTime);
};

var _default = createIdleTimer;
exports.default = _default;
module.exports = exports.default;