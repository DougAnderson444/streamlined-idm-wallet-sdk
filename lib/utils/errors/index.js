"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  UnavailableIpfsError: true,
  InvalidMasterLockOperationError: true
};
exports.InvalidMasterLockOperationError = exports.UnavailableIpfsError = void 0;

var _base = _interopRequireDefault(require("./base"));

var _didm = require("./didm");

Object.keys(_didm).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _didm[key];
    }
  });
});

var _identities = require("./identities");

Object.keys(_identities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _identities[key];
    }
  });
});

var _locker = require("./locker");

Object.keys(_locker).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locker[key];
    }
  });
});

var _storage = require("./storage");

Object.keys(_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _storage[key];
    }
  });
});

var _sessions = require("./sessions");

Object.keys(_sessions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sessions[key];
    }
  });
});

var _crypto = require("./crypto");

Object.keys(_crypto).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _crypto[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UnavailableIpfsError extends _base.default {
  constructor() {
    super('IPFS node is unavailable', 'IPFS_UNAVAILABLE');
  }

}

exports.UnavailableIpfsError = UnavailableIpfsError;

class InvalidMasterLockOperationError extends _base.default {
  constructor() {
    super('Invalid master lock operation', 'INVALID_MASTER_OPERATION');
  }

}

exports.InvalidMasterLockOperationError = InvalidMasterLockOperationError;