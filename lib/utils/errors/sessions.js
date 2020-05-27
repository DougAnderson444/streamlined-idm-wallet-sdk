"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  UnknownSessionError: true
};
exports.UnknownSessionError = void 0;

var _base = _interopRequireDefault(require("./base"));

var _session = require("./session");

Object.keys(_session).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _session[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UnknownSessionError extends _base.default {
  constructor(sessionId) {
    super(`Unknown session with: ${sessionId}`, 'UNKNOWN_SESSION');
  }

}

exports.UnknownSessionError = UnknownSessionError;