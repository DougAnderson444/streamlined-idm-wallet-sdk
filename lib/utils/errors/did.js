"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidDidParts = exports.InvalidDidUrlError = exports.InvalidDidError = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InvalidDidError extends _base.default {
  constructor(message) {
    super(message, 'INVALID_DID');
  }

}

exports.InvalidDidError = InvalidDidError;

class InvalidDidUrlError extends _base.default {
  constructor(message) {
    super(message, 'INVALID_DID_URL');
  }

}

exports.InvalidDidUrlError = InvalidDidUrlError;

class InvalidDidParts extends _base.default {
  constructor(message) {
    super(message, 'INVALID_DID_PARTS');
  }

}

exports.InvalidDidParts = InvalidDidParts;