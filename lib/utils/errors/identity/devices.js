"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnsupportedDeviceInfoPropertyError = exports.InvalidDeviceOperationError = exports.UnknownDeviceError = exports.InvalidDevicePropertyError = void 0;

var _base = _interopRequireDefault(require("../base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InvalidDevicePropertyError extends _base.default {
  constructor(property, value) {
    super(`Invalid device ${property}: ${value}`, 'INVALID_DEVICE_PROPERTY');
  }

}

exports.InvalidDevicePropertyError = InvalidDevicePropertyError;

class UnknownDeviceError extends _base.default {
  constructor(id) {
    super(`Unknown device with id: ${id}`, 'UNKNOWN_DEVICE');
  }

}

exports.UnknownDeviceError = UnknownDeviceError;

class InvalidDeviceOperationError extends _base.default {
  constructor(msg) {
    super(msg, 'INVALID_DEVICE_OPERATION');
  }

}

exports.InvalidDeviceOperationError = InvalidDeviceOperationError;

class UnsupportedDeviceInfoPropertyError extends _base.default {
  constructor(property) {
    super(`Property ${property} is not supported`, 'UNSUPPORTED_DEVICE_INFO_PROPERTY');
  }

}

exports.UnsupportedDeviceInfoPropertyError = UnsupportedDeviceInfoPropertyError;