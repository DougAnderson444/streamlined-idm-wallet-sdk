"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertDeviceInfo = void 0;

var _devices = require("../constants/devices");

var _errors = require("../../../../utils/errors");

const assertDeviceInfo = deviceInfo => {
  const {
    type,
    name,
    ...rest
  } = deviceInfo || {};

  if (!_devices.DEVICE_TYPES.includes(type)) {
    throw new _errors.InvalidDevicePropertyError('type', type);
  }

  if (!name || typeof name !== 'string') {
    throw new _errors.InvalidDevicePropertyError('name', name);
  }

  const otherProps = Object.keys(rest);

  if (otherProps.length) {
    throw new _errors.UnsupportedDeviceInfoPropertyError(otherProps[0]);
  }
};

exports.assertDeviceInfo = assertDeviceInfo;