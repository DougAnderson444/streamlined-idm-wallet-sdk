"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ipid = _interopRequireDefault(require("./methods/ipid"));

var _did = require("../utils/did");

var _errors = require("../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Didm {
  constructor(methods) {
    _methods.set(this, {
      writable: true,
      value: void 0
    });

    _assertSupport.set(this, {
      writable: true,
      value: (method, purpose) => {
        if (!_classPrivateFieldGet(this, _methods)[method]) {
          throw new _errors.UnsupportedDidMethodError(method);
        }

        if (!_classPrivateFieldGet(this, _methods)[method][purpose]) {
          throw new _errors.UnsupportedDidMethodPurposeError(method, purpose);
        }
      }
    });

    _classPrivateFieldSet(this, _methods, methods);
  }

  async getDid(method, params) {
    _classPrivateFieldGet(this, _assertSupport).call(this, method, 'getDid');

    return _classPrivateFieldGet(this, _methods)[method].getDid(params);
  }

  async resolve(did) {
    const {
      method
    } = (0, _did.parseDid)(did);

    _classPrivateFieldGet(this, _assertSupport).call(this, method, 'resolve');

    return _classPrivateFieldGet(this, _methods)[method].resolve(did);
  }

  async create(method, params, operations) {
    _classPrivateFieldGet(this, _assertSupport).call(this, method, 'create');

    return _classPrivateFieldGet(this, _methods)[method].create(params, operations);
  }

  async update(did, params, operations) {
    const {
      method
    } = (0, _did.parseDid)(did);

    _classPrivateFieldGet(this, _assertSupport).call(this, method, 'update');

    return _classPrivateFieldGet(this, _methods)[method].update(did, params, operations);
  }

  async isPublicKeyValid(did, publicKeyId, options) {
    const {
      method
    } = (0, _did.parseDid)(did);

    _classPrivateFieldGet(this, _assertSupport).call(this, method, 'isPublicKeyValid');

    return _classPrivateFieldGet(this, _methods)[method].isPublicKeyValid(did, publicKeyId, options);
  }

  getMethods() {
    return Object.values(_classPrivateFieldGet(this, _methods)).map(method => method.constructor.info);
  }

  isSupported(method, purpose) {
    try {
      _classPrivateFieldGet(this, _assertSupport).call(this, method, purpose);

      return true;
    } catch (err) {
      return false;
    }
  }

}

var _methods = new WeakMap();

var _assertSupport = new WeakMap();

const createDidm = (ipfs, apiMultiAddr, wsMultiAddr) => {
  const methods = {
    ipid: (0, _ipid.default)(ipfs, apiMultiAddr, wsMultiAddr)
  };
  return new Didm(methods);
};

var _default = createDidm;
exports.default = _default;
module.exports = exports.default;