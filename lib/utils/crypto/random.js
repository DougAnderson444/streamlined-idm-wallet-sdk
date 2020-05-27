"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const getRandomBytes = size => crypto.getRandomValues(new Uint8Array(size));

var _default = getRandomBytes;
exports.default = _default;
module.exports = exports.default;