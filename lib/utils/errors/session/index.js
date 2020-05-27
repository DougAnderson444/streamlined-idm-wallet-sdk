"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateSessionRevokedIdentityError = exports.InvalidSessionOptionsError = void 0;

var _base = _interopRequireDefault(require("../base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InvalidSessionOptionsError extends _base.default {
  constructor() {
    super('Session options must be a plain object', 'INVALID_SESSION_OPTIONS');
  }

}

exports.InvalidSessionOptionsError = InvalidSessionOptionsError;

class CreateSessionRevokedIdentityError extends _base.default {
  constructor(identityId) {
    super(`Unable to create session for revoked identity: ${identityId}`, 'CREATE_SESSION_REVOKED_IDENTITY');
  }

}

exports.CreateSessionRevokedIdentityError = CreateSessionRevokedIdentityError;