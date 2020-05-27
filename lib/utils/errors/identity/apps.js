"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidAppPropertyError = exports.UnknownAppError = void 0;

var _base = _interopRequireDefault(require("../base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UnknownAppError extends _base.default {
  constructor(appId) {
    super(`Unknown app with id: ${appId}`, 'UNKNOWN_APPLICAITON');
  }

}

exports.UnknownAppError = UnknownAppError;

class InvalidAppPropertyError extends _base.default {
  constructor(property, value) {
    super(`Invalid application ${property}: ${value}`, 'INVALID_APPLICATION_PROPERTY');
  }

}

exports.InvalidAppPropertyError = InvalidAppPropertyError;