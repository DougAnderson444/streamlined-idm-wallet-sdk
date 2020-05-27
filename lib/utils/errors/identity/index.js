"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  IdentityRevokedError: true,
  InvalidIdentityPropertyError: true
};
exports.InvalidIdentityPropertyError = exports.IdentityRevokedError = void 0;

var _base = _interopRequireDefault(require("../base"));

var _profile = require("./profile");

Object.keys(_profile).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _profile[key];
    }
  });
});

var _devices = require("./devices");

Object.keys(_devices).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _devices[key];
    }
  });
});

var _backup = require("./backup");

Object.keys(_backup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _backup[key];
    }
  });
});

var _apps = require("./apps");

Object.keys(_apps).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _apps[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IdentityRevokedError extends _base.default {
  constructor(message) {
    super(message, 'IDENTITY_REVOKED');
  }

}

exports.IdentityRevokedError = IdentityRevokedError;

class InvalidIdentityPropertyError extends _base.default {
  constructor(property, value) {
    super(`Invalid identity ${property}: ${value}`, 'INVALID_IDENTITY_PROPERTY');
  }

}

exports.InvalidIdentityPropertyError = InvalidIdentityPropertyError;