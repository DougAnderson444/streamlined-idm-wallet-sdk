"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ipfsHttpClient = _interopRequireDefault(require("ipfs-http-client"));

var _infura = require("./constants/infura");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const endpointUrl = new URL(_infura.INFURA_IPFS_ENDPOINT);

var _default = (0, _ipfsHttpClient.default)({
  host: endpointUrl.hostname,
  port: endpointUrl.port,
  protocol: endpointUrl.protocol.slice(0, -1),
  'api-url': endpointUrl.pathname
});

exports.default = _default;
module.exports = exports.default;