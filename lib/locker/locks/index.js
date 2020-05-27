"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _passphrase = _interopRequireDefault(require("./passphrase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createLocks = async (storage, secret, masterLockType) => {
  const locks = await Promise.all([(0, _passphrase.default)(storage, secret, masterLockType)]);
  return locks.reduce((acc, lock) => {
    acc[lock.getType()] = lock;
    return acc;
  }, {});
};

var _default = createLocks;
exports.default = _default;
module.exports = exports.default;