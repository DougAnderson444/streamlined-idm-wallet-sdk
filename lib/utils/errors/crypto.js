"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnsupportedCypherAlgorithm = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UnsupportedCypherAlgorithm extends _base.default {
  constructor(algorithm) {
    super(`Unsupported cypher algorithm: ${algorithm}`, 'UNSUPPORTED_CYPHER_ALGORITHM');
  }

}

exports.UnsupportedCypherAlgorithm = UnsupportedCypherAlgorithm;