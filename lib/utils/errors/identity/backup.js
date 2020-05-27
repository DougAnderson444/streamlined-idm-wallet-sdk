"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidBackupPropertyError = void 0;

var _base = _interopRequireDefault(require("../base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InvalidBackupPropertyError extends _base.default {
  constructor(property, value) {
    super(`Invalid backup ${property}: ${value}`, 'INVALID_BACKUP_PROPERTY');
  }

}

exports.InvalidBackupPropertyError = InvalidBackupPropertyError;