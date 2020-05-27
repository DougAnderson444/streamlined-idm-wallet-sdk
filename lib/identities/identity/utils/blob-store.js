"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _buffer = require("buffer");

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _pTimeout = _interopRequireDefault(require("p-timeout"));

var _infuraIpfs = _interopRequireDefault(require("./infura-ipfs"));

var _infura = require("./constants/infura");

var _errors = require("../../../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class BlobStore {
  constructor(ipfs) {
    _ipfs.set(this, {
      writable: true,
      value: void 0
    });

    _refs.set(this, {
      writable: true,
      value: new Map()
    });

    _onChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _syncRemoved.set(this, {
      writable: true,
      value: async key => {
        _classPrivateFieldGet(this, _refs).delete(key);

        _classPrivateFieldGet(this, _notifyChange).call(this, key);
      }
    });

    _syncUpdated.set(this, {
      writable: true,
      value: async (key, ref) => {
        await _classPrivateFieldGet(this, _syncAdded).call(this, key, ref);
      }
    });

    _syncAdded.set(this, {
      writable: true,
      value: async (key, ref) => {
        ref = { ...ref,
          status: 'syncing',
          error: undefined
        };

        _classPrivateFieldGet(this, _refs).set(key, ref);

        _classPrivateFieldGet(this, _notifyChange).call(this, key);

        let updatedRef; // Attempt to pin the blob && ensure it's on infura

        try {
          await _classPrivateFieldGet(this, _ipfs).pin.add(ref.hash);

          _classPrivateFieldGet(this, _maybeAddToInfura).call(this, key, ref.hash).catch(err => console.warn(`Unable to check and add "${key}" to infura`, err));

          updatedRef = { ...ref,
            status: 'synced',
            error: undefined
          };
        } catch (error) {
          updatedRef = { ...ref,
            status: 'error',
            error
          };
        }

        const stillExactSame = _classPrivateFieldGet(this, _refs).get(key) === ref;

        if (stillExactSame) {
          _classPrivateFieldGet(this, _refs).set(key, updatedRef);

          _classPrivateFieldGet(this, _notifyChange).call(this, key, true);
        }
      }
    });

    _notifyChange.set(this, {
      writable: true,
      value: (key, async = false) => {
        const ref = _classPrivateFieldGet(this, _refs).get(key);

        _classPrivateFieldGet(this, _onChange).dispatch(key, ref, async);
      }
    });

    _addToIpfs.set(this, {
      writable: true,
      value: async blob => {
        const buffer = _buffer.Buffer.from(blob.data);

        const [{
          hash
        }] = await _classPrivateFieldGet(this, _ipfs).add(buffer, {
          cidVersion: 0,
          pin: true
        });
        return hash;
      }
    });

    _maybeAddToInfura.set(this, {
      writable: true,
      value: async (key, hash, data) => {
        // Check if files exists in infura
        const exists = await (0, _pTimeout.default)(_infuraIpfs.default.block.stat(hash).then(() => true), _infura.INFURA_HAS_FILE_TIMEOUT, () => false);

        if (exists) {
          return;
        } // If there's no data yet, grab it


        if (!data) {
          const [{
            content: buffer
          }] = await _classPrivateFieldGet(this, _ipfs).get(hash);
          data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        }

        await _classPrivateFieldGet(this, _addToInfura).call(this, key, hash, data);
      }
    });

    _addToInfura.set(this, {
      writable: true,
      value: async (key, hash, data) => {
        const buffer = _buffer.Buffer.from(data);

        const [{
          hash: infuraHash
        }] = await (0, _pTimeout.default)(_infuraIpfs.default.add(buffer, {
          cidVersion: 0,
          pin: true
        }), _infura.INFURA_ADD_FILE_TIMEOUT);

        if (infuraHash !== hash) {
          throw new _errors.InfuraHashMismatch(infuraHash, hash);
        }

        return hash;
      }
    });

    _classPrivateFieldSet(this, _ipfs, ipfs);
  }

  get(key) {
    return _classPrivateFieldGet(this, _refs).get(key);
  }

  getUrl(key) {
    const ref = _classPrivateFieldGet(this, _refs).get(key);

    return ref && ref.status === 'synced' ? `${_infura.INFURA_IPFS_ENDPOINT}/cat?arg=${ref.hash}` : undefined;
  }

  async put(key, blob) {
    const {
      type
    } = blob;
    const hash = await _classPrivateFieldGet(this, _addToIpfs).call(this, blob);
    await _classPrivateFieldGet(this, _addToInfura).call(this, key, hash, blob.data).catch(err => console.warn(`Unable to add "${key}" to infura`, err));

    let ref = _classPrivateFieldGet(this, _refs).get(key); // Skip if hash & type are the same and it's already loaded to avoid triggering change


    if (ref && ref.type === type && ref.hash === hash && ref.status === 'synced') {
      return ref;
    }

    ref = {
      type,
      hash,
      status: 'synced',
      error: undefined
    };

    _classPrivateFieldGet(this, _refs).set(key, ref);

    _classPrivateFieldGet(this, _notifyChange).call(this, key);

    return ref;
  }

  async del(key) {
    const ref = _classPrivateFieldGet(this, _refs).get(key); // Skip if already removed to avoid triggering change


    if (ref) {
      _classPrivateFieldGet(this, _refs).delete(key);

      _classPrivateFieldGet(this, _notifyChange).call(this, key);
    }
  }

  async sync(refs) {
    const refsKeys = Object.keys(refs);
    const currentKeys = Array.from(_classPrivateFieldGet(this, _refs).keys());
    const removedKeys = (0, _difference2.default)(currentKeys, refsKeys);
    const addedKeys = (0, _difference2.default)(refsKeys, currentKeys);
    const updatedKeys = refsKeys.filter(key => {
      const ref = refs[key];

      const currentRef = _classPrivateFieldGet(this, _refs).get(key);

      return currentRef && (ref.type !== currentRef.type || ref.hash !== currentRef.hash);
    });
    await Promise.all([...removedKeys.map(key => _classPrivateFieldGet(this, _syncRemoved).call(this, key)), ...addedKeys.map(key => _classPrivateFieldGet(this, _syncAdded).call(this, key, refs[key])), ...updatedKeys.map(key => _classPrivateFieldGet(this, _syncUpdated).call(this, key, refs[key]))]);
  }

  onChange(fn) {
    return _classPrivateFieldGet(this, _onChange).add(fn);
  }

}

var _ipfs = new WeakMap();

var _refs = new WeakMap();

var _onChange = new WeakMap();

var _syncRemoved = new WeakMap();

var _syncUpdated = new WeakMap();

var _syncAdded = new WeakMap();

var _notifyChange = new WeakMap();

var _addToIpfs = new WeakMap();

var _maybeAddToInfura = new WeakMap();

var _addToInfura = new WeakMap();

const createBlobStore = ipfs => new BlobStore(ipfs);

var _default = createBlobStore;
exports.default = _default;
module.exports = exports.default;