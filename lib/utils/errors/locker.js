"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LockerLockedError: true,
  PristineError: true,
  UnknownLockTypeError: true
};
exports.UnknownLockTypeError = exports.PristineError = exports.LockerLockedError = void 0;

var _base = _interopRequireDefault(require("./base"));

var _locks = require("./locks");

Object.keys(_locks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locks[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LockerLockedError extends _base.default {
  constructor() {
    super('Locker is locked', 'LOCKED');
  }

}

exports.LockerLockedError = LockerLockedError;

class PristineError extends _base.default {
  constructor() {
    super('Can\'t lock until you configure the master lock', 'IS_PRISTINE');
  }

}

exports.PristineError = PristineError;

class UnknownLockTypeError extends _base.default {
  constructor(lockType) {
    super(`There's no lock of type \`${lockType}\``, 'UNKNOWN_LOCK_TYPE');
  }

}

exports.UnknownLockTypeError = UnknownLockTypeError;