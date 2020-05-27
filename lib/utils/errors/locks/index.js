"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LockDisabledError = exports.LockEnabledError = exports.UnlockMismatchError = exports.LockValidationError = void 0;

var _base = _interopRequireDefault(require("../base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LockValidationError extends _base.default {
  constructor(message, props) {
    message = message || 'Lock validation unsuccessful';
    super(message, 'LOCK_VALIDATION', props);
  }

}

exports.LockValidationError = LockValidationError;

class UnlockMismatchError extends _base.default {
  constructor(message) {
    message = message || 'Provided input is invalid';
    super(message, 'UNLOCK_INPUT_MISMATCH');
  }

}

exports.UnlockMismatchError = UnlockMismatchError;

class LockEnabledError extends _base.default {
  constructor() {
    super('Lock must be disabled', 'LOCK_NOT_DISABLED');
  }

}

exports.LockEnabledError = LockEnabledError;

class LockDisabledError extends _base.default {
  constructor() {
    super('Lock must be enabled', 'LOCK_NOT_ENABLED');
  }

}

exports.LockDisabledError = LockDisabledError;