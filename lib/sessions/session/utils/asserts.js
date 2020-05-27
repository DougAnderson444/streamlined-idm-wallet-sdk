"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertSessionOptions = void 0;

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _errors = require("../../../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const assertSessionOptions = options => {
  if (options && !(0, _isPlainObject2.default)(options)) {
    throw new _errors.InvalidSessionOptionsError();
  }
};

exports.assertSessionOptions = assertSessionOptions;