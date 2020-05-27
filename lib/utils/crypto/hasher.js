"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashSha512 = exports.hashSha384 = exports.hashSha256 = exports.hashSha1 = exports.hash = void 0;

var _hexArray = _interopRequireDefault(require("hex-array"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hash = async (input, algorithm, hex = false) => {
  // Encode as UTF-8 to obtain an ArrayBuffer if input is a string
  if (typeof input === 'string') {
    input = new TextEncoder('utf-8').encode(input);
  }

  const result = await crypto.subtle.digest('SHA-256', input);
  let hash = new Uint8Array(result);

  if (hex) {
    hash = _hexArray.default.toString(hash, {
      uppercase: false
    });
  }

  return hash;
};

exports.hash = hash;

const hashSha1 = (input, hex) => hash(input, 'SHA-1', hex);

exports.hashSha1 = hashSha1;

const hashSha256 = (input, hex) => hash(input, 'SHA-256', hex);

exports.hashSha256 = hashSha256;

const hashSha384 = (input, hex) => hash(input, 'SHA-384', hex);

exports.hashSha384 = hashSha384;

const hashSha512 = (input, hex) => hash(input, 'SHA-512', hex);

exports.hashSha512 = hashSha512;