"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeProfile = exports.restoreProfile = exports.createProfile = exports.peekProfileDetails = void 0;

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _has2 = _interopRequireDefault(require("lodash/has"));

var _pick2 = _interopRequireDefault(require("lodash/pick"));

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _delay = _interopRequireDefault(require("delay"));

var _pSeries = _interopRequireDefault(require("p-series"));

var _orbitdb = require("./utils/orbitdb");

var _blobStore2 = _interopRequireDefault(require("./utils/blob-store"));

var _asserts = require("./utils/asserts");

var _errors = require("../../utils/errors");

var _profile = require("./utils/constants/profile");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const peekDropStoreTimers = new Map();

class Profile {
  constructor(orbitdbStore, blobStore) {
    _orbitdbStore.set(this, {
      writable: true,
      value: void 0
    });

    _blobStore.set(this, {
      writable: true,
      value: void 0
    });

    _details.set(this, {
      writable: true,
      value: void 0
    });

    _onChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _saveProperty.set(this, {
      writable: true,
      value: async (key, value) => {
        if (_profile.PROFILE_BLOB_PROPERTIES.includes(key)) {
          const blobRef = await _classPrivateFieldGet(this, _blobStore).put(key, value);
          value = (0, _pick2.default)(blobRef, 'type', 'hash');
        }

        if (!(0, _isEqual2.default)(_classPrivateFieldGet(this, _orbitdbStore).get(key), value)) {
          await _classPrivateFieldGet(this, _orbitdbStore).put(key, value);
        }
      }
    });

    _removeProperty.set(this, {
      writable: true,
      value: async key => {
        if ((0, _has2.default)(_classPrivateFieldGet(this, _orbitdbStore).all, key)) {
          await _classPrivateFieldGet(this, _orbitdbStore).del(key);
        }
      }
    });

    _syncBlobStore.set(this, {
      writable: true,
      value: () => {
        const blobRefs = (0, _pick2.default)(_classPrivateFieldGet(this, _orbitdbStore).all, _profile.PROFILE_BLOB_PROPERTIES);

        _classPrivateFieldGet(this, _blobStore).sync(blobRefs);
      }
    });

    _maybeUpdateDetails.set(this, {
      writable: true,
      value: () => {
        const details = { ..._classPrivateFieldGet(this, _orbitdbStore).all
        };

        _profile.PROFILE_BLOB_PROPERTIES.forEach(key => {
          if (details[key]) {
            details[key] = _classPrivateFieldGet(this, _blobStore).getUrl(key);
          }
        });

        if (!(0, _isEqual2.default)(_classPrivateFieldGet(this, _details), details)) {
          _classPrivateFieldSet(this, _details, details);
        }
      }
    });

    _handleOrbitdbStoreChange.set(this, {
      writable: true,
      value: () => {
        _classPrivateFieldGet(this, _syncBlobStore).call(this);

        _classPrivateFieldGet(this, _maybeUpdateDetails).call(this);

        _classPrivateFieldGet(this, _onChange).dispatch();
      }
    });

    _handleBlobStoreChange.set(this, {
      writable: true,
      value: (key, ref, async) => {
        if (async) {
          _classPrivateFieldGet(this, _maybeUpdateDetails).call(this);

          _classPrivateFieldGet(this, _onChange).dispatch();
        }
      }
    });

    _classPrivateFieldSet(this, _orbitdbStore, orbitdbStore);

    _classPrivateFieldGet(this, _orbitdbStore).events.on('write', _classPrivateFieldGet(this, _handleOrbitdbStoreChange));

    _classPrivateFieldGet(this, _orbitdbStore).events.on('replicated', _classPrivateFieldGet(this, _handleOrbitdbStoreChange));

    _classPrivateFieldSet(this, _blobStore, blobStore);

    _classPrivateFieldGet(this, _blobStore).onChange(_classPrivateFieldGet(this, _handleBlobStoreChange));

    _classPrivateFieldGet(this, _syncBlobStore).call(this);

    _classPrivateFieldGet(this, _maybeUpdateDetails).call(this);
  }

  getProperty(key) {
    return _classPrivateFieldGet(this, _blobStore).get(key) || _classPrivateFieldGet(this, _orbitdbStore).get(key);
  }

  async setProperty(key, value) {
    (0, _asserts.assertProfileProperty)(key, value);
    await _classPrivateFieldGet(this, _saveProperty).call(this, key, value);
  }

  async unsetProperty(key) {
    (0, _asserts.assertNonMandatoryProfileProperty)(key);
    await _classPrivateFieldGet(this, _removeProperty).call(this, key);
  }

  async setProperties(properties) {
    const tasks = Object.entries(properties).map(([key, value]) => {
      if (value === undefined) {
        (0, _asserts.assertNonMandatoryProfileProperty)(key);
        return () => _classPrivateFieldGet(this, _removeProperty).call(this, key);
      }

      (0, _asserts.assertProfileProperty)(key, value);
      return () => _classPrivateFieldGet(this, _saveProperty).call(this, key, value);
    });
    return (0, _pSeries.default)(tasks);
  }

  getDetails() {
    return _classPrivateFieldGet(this, _details);
  }

  onChange(fn) {
    return _classPrivateFieldGet(this, _onChange).add(fn);
  }

}

var _orbitdbStore = new WeakMap();

var _blobStore = new WeakMap();

var _details = new WeakMap();

var _onChange = new WeakMap();

var _saveProperty = new WeakMap();

var _removeProperty = new WeakMap();

var _syncBlobStore = new WeakMap();

var _maybeUpdateDetails = new WeakMap();

var _handleOrbitdbStoreChange = new WeakMap();

var _handleBlobStoreChange = new WeakMap();

const waitProfileReplication = async (orbitdbStore, blobStore) => {
  const completed = await (0, _orbitdb.waitStoreReplication)(orbitdbStore, {
    timeout: _profile.PEEK_REPLICATION_WAIT_TIME,
    completeCondition: () => _profile.PROFILE_MANDATORY_PROPERTIES.every(key => orbitdbStore.get(key) != null)
  });

  if (!completed) {
    throw new _errors.ProfileReplicationTimeoutError();
  }

  const image = orbitdbStore.get('image');

  if (image) {
    await Promise.race([_delay.default.reject(_profile.PEEK_REPLICATION_WAIT_TIME, {
      value: new _errors.ProfileReplicationTimeoutError()
    }), blobStore.sync({
      image
    }).catch(err => {
      console.warn('Unable to replicate image blob, skipping..', err);
    })]);
  }
};

const peekDropStore = (identityId, orbitdb, orbitdbStore) => {
  const timeoutId = setTimeout(async () => {
    try {
      await orbitdbStore.drop();
      await (0, _orbitdb.dropOrbitDbIfEmpty)(orbitdb);
    } catch (err) {
      console.warn(`Unable to drop profile OrbitDB store for identity after peeking: ${identityId.id}`, err);
    }
  }, _profile.PEEK_DROP_DELAY);
  peekDropStoreTimers.set(orbitdbStore, timeoutId);
};

const cancelPeekDropStore = orbitdbStore => {
  const timeoutId = peekDropStoreTimers.get(orbitdbStore);
  clearTimeout(timeoutId);
  peekDropStoreTimers.delete(orbitdbStore);
};

const peekProfileDetails = async (identityDescriptor, ipfs, orbitdb) => {
  const orbitdbStore = await (0, _orbitdb.loadStore)(orbitdb, _profile.ORBITDB_STORE_NAME, _profile.ORBITDB_STORE_TYPE);
  const blobStore = (0, _blobStore2.default)(ipfs);
  cancelPeekDropStore(orbitdbStore); // Wait for it to replicate if necessary

  await waitProfileReplication(orbitdbStore, blobStore); // To allow a fast import of the identity, we delay the drop of the DB

  peekDropStore(identityDescriptor.id, orbitdb, orbitdbStore);
  const profile = new Profile(orbitdbStore, blobStore);
  return profile.getDetails();
};

exports.peekProfileDetails = peekProfileDetails;

const createProfile = async (details, identityDescriptor, ipfs, orbitdb) => {
  const orbitdbStore = await (0, _orbitdb.loadStore)(orbitdb, _profile.ORBITDB_STORE_NAME, _profile.ORBITDB_STORE_TYPE);
  const blobStore = (0, _blobStore2.default)(ipfs);
  const profile = new Profile(orbitdbStore, blobStore);
  cancelPeekDropStore(orbitdbStore);

  if (details) {
    await orbitdbStore.put('identifier', identityDescriptor.did);

    for (const [key, value] of Object.entries(details)) {
      await profile.setProperty(key, value); // eslint-disable-line no-await-in-loop
    }
  } else {
    await waitProfileReplication(orbitdbStore, blobStore);
  }

  return profile;
};

exports.createProfile = createProfile;

const restoreProfile = async (identityDescriptor, ipfs, orbitdb) => {
  const orbitdbStore = await (0, _orbitdb.loadStore)(orbitdb, _profile.ORBITDB_STORE_NAME, _profile.ORBITDB_STORE_TYPE);
  const blobStore = (0, _blobStore2.default)(ipfs);
  cancelPeekDropStore(orbitdbStore);
  return new Profile(orbitdbStore, blobStore);
};

exports.restoreProfile = restoreProfile;

const removeProfile = async (identityDescriptor, ipfs, orbitdb) => {
  await (0, _orbitdb.dropStore)(orbitdb, _profile.ORBITDB_STORE_NAME, _profile.ORBITDB_STORE_TYPE);
};

exports.removeProfile = removeProfile;