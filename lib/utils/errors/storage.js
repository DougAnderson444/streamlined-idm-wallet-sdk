"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageError = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class StorageError extends _base.default {
  constructor(message, operation, type) {
    message = message || 'Something went wrong during storage operations';
    super(message, 'STORAGE_OPERATION', {
      operation,
      type
    });
  }

}

exports.StorageError = StorageError;