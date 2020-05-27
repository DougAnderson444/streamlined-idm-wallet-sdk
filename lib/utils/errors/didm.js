"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MissingDidParameters = exports.UnsupportedDidMethodPurposeError = exports.UnsupportedDidMethodError = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UnsupportedDidMethodError extends _base.default {
  constructor(didMethod) {
    super(`Did method \`${didMethod}\` is not supported`, 'UNSUPPORTED_DID_METHOD');
  }

}

exports.UnsupportedDidMethodError = UnsupportedDidMethodError;

class UnsupportedDidMethodPurposeError extends _base.default {
  constructor(didMethod, purpose) {
    super(`Purpose \`${purpose}\` is not currently supported for \`${didMethod}\``, 'UNSUPPORTED_DID_METHOD_PURPOSE');
  }

}

exports.UnsupportedDidMethodPurposeError = UnsupportedDidMethodPurposeError;

class MissingDidParameters extends _base.default {
  constructor(message) {
    super(message, 'MISSING_DID_PARAMETERS');
  }

}

exports.MissingDidParameters = MissingDidParameters;