"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  IdentitiesNotLoadedError: true,
  UnknownIdentityError: true,
  IdentityAlreadyExistsError: true
};
exports.IdentityAlreadyExistsError = exports.UnknownIdentityError = exports.IdentitiesNotLoadedError = void 0;

var _base = _interopRequireDefault(require("./base"));

var _identity = require("./identity");

Object.keys(_identity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _identity[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IdentitiesNotLoadedError extends _base.default {
  constructor() {
    super('Identites are still not loaded', 'IDENTITIES_NOT_LOADED');
  }

}

exports.IdentitiesNotLoadedError = IdentitiesNotLoadedError;

class UnknownIdentityError extends _base.default {
  constructor(did) {
    super(`Unknown identity with: ${did}`, 'UNKNOWN_IDENTITY');
  }

}

exports.UnknownIdentityError = UnknownIdentityError;

class IdentityAlreadyExistsError extends _base.default {
  constructor(did) {
    super(`Identity with the following did already exists: ${did}`, 'IDENTITY_ALREADY_EXISTS');
  }

}

exports.IdentityAlreadyExistsError = IdentityAlreadyExistsError;