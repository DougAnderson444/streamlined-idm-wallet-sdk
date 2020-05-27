"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfuraHashMismatch = exports.ProfileReplicationTimeoutError = exports.UnsupportedProfilePropertyError = exports.InvalidProfileMandatoryPropertyError = exports.InvalidProfilePropertyError = void 0;

var _base = _interopRequireDefault(require("../base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InvalidProfilePropertyError extends _base.default {
  constructor(property, value) {
    super(`Invalid profile ${property}: ${value}`, 'INVALID_PROFILE_PROPERTY');
  }

}

exports.InvalidProfilePropertyError = InvalidProfilePropertyError;

class InvalidProfileMandatoryPropertyError extends _base.default {
  constructor(property) {
    super(`Invalid operation with mandatory profile property: ${property}`, 'INVALID_OPERATION_MANADATORY_PROPERTY');
  }

}

exports.InvalidProfileMandatoryPropertyError = InvalidProfileMandatoryPropertyError;

class UnsupportedProfilePropertyError extends _base.default {
  constructor(property) {
    super(`Property ${property} is not supported`, 'UNSUPPORTED_PROFILE_PROPERTY');
  }

}

exports.UnsupportedProfilePropertyError = UnsupportedProfilePropertyError;

class ProfileReplicationTimeoutError extends _base.default {
  constructor() {
    super('Profile replication timed out', 'PROFILE_REPLICATION_TIMEOUT');
  }

}

exports.ProfileReplicationTimeoutError = ProfileReplicationTimeoutError;

class InfuraHashMismatch extends _base.default {
  constructor(infuraHash, expectedHash) {
    super(`Expecting infura response hash to be "${expectedHash}" but got "${infuraHash} instead`, 'INFURA_HASH_MISMATCH');
  }

}

exports.InfuraHashMismatch = InfuraHashMismatch;