"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class BaseError extends Error {
  constructor(message, code, props) {
    super(message);
    Object.assign(this, { ...props,
      code,
      name: this.constructor.name
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    this.stack = new Error(message).stack;
  }

}

var _default = BaseError;
exports.default = _default;
module.exports = exports.default;