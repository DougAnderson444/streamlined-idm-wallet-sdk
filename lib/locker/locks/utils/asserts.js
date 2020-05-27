"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertDisabled = exports.assertEnabled = exports.assertNotMaster = void 0;

var _errors = require("../../../utils/errors");

const assertNotMaster = master => {
  if (master) {
    throw new _errors.InvalidMasterLockOperationError();
  }
};

exports.assertNotMaster = assertNotMaster;

const assertEnabled = enabled => {
  if (!enabled) {
    throw new _errors.LockDisabledError();
  }
};

exports.assertEnabled = assertEnabled;

const assertDisabled = enabled => {
  if (enabled) {
    throw new _errors.LockEnabledError();
  }
};

exports.assertDisabled = assertDisabled;