"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _identities2 = require("../identities");

var _errors = require("../utils/errors");

var _session = require("./session");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Sessions {
  constructor(_sessions2, storage, identities) {
    _sessions.set(this, {
      writable: true,
      value: void 0
    });

    _storage.set(this, {
      writable: true,
      value: void 0
    });

    _identities.set(this, {
      writable: true,
      value: void 0
    });

    _identityListeners.set(this, {
      writable: true,
      value: new Map()
    });

    _onDestroy.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _getSessionByIdentityAndAppId.set(this, {
      writable: true,
      value: (identityId, appId, sessions = _classPrivateFieldGet(this, _sessions)) => Object.values(sessions).find(session => session.getAppId() === appId && session.getIdentityId() === identityId)
    });

    _getSessionsByIdentityId.set(this, {
      writable: true,
      value: (identityId, sessions = _classPrivateFieldGet(this, _sessions)) => Object.values(sessions).filter(session => session.getIdentityId() === identityId)
    });

    _destroySessionsByIdentityId.set(this, {
      writable: true,
      value: async identityId => {
        const identitySessions = _classPrivateFieldGet(this, _getSessionsByIdentityId).call(this, identityId);

        await Promise.all(identitySessions.map(session => this.destroy(session.getId())));
      }
    });

    _addIdentityListeners.set(this, {
      writable: true,
      value: identityId => {
        if (_classPrivateFieldGet(this, _identityListeners).has(identityId)) {
          return;
        }

        const identity = _classPrivateFieldGet(this, _identities).get(identityId);

        const removeRevokeListener = identity.onRevoke((...args) => _classPrivateFieldGet(this, _handleIdentityRevoke).call(this, identityId, ...args));
        const removeLinkChangeListener = identity.apps.onLinkCurrentChange((...args) => _classPrivateFieldGet(this, _handleLinkCurrentChange).call(this, identityId, ...args));

        _classPrivateFieldGet(this, _identityListeners).set(identityId, {
          removeRevokeListener,
          removeLinkChangeListener
        });
      }
    });

    _removeIdentityListeners.set(this, {
      writable: true,
      value: identityId => {
        if (!_classPrivateFieldGet(this, _identityListeners).has(identityId)) {
          return;
        }

        const listeners = _classPrivateFieldGet(this, _identityListeners).get(identityId);

        listeners.removeRevokeListener();
        listeners.removeLinkChangeListener();

        _classPrivateFieldGet(this, _identityListeners).delete(identityId);
      }
    });

    _handleIdentitiesLoad.set(this, {
      writable: true,
      value: () => {
        Object.values(_classPrivateFieldGet(this, _identities).list()).forEach(identity => {
          const apps = identity.apps.list();
          const identityId = identity.getId();
          apps.forEach(app => {
            const session = _classPrivateFieldGet(this, _getSessionByIdentityAndAppId).call(this, identityId, app.id);

            if (!session) {
              identity.apps.unlinkCurrentDevice(app.id).catch(err => console.warn(`Something went wrong unlinking current device with app "${app.id}" for identity "${identityId}". Will retry on reload.`, err));
            }
          });

          _classPrivateFieldGet(this, _addIdentityListeners).call(this, identity.getId());
        });
        Object.values(_classPrivateFieldGet(this, _sessions)).forEach(session => {
          const sessionId = session.getId();
          const identityId = session.getIdentityId();

          if (!_classPrivateFieldGet(this, _identities).has(identityId) || _classPrivateFieldGet(this, _identities).get(identityId).isRevoked()) {
            this.destroy(sessionId).catch(err => console.warn(`Something went wrong destroying session "${sessionId}" for identity "${identityId}". Will retry on reload.`, err));
          }
        });
      }
    });

    _handleIdentitiesChange.set(this, {
      writable: true,
      value: async (identities, operation) => {
        const {
          type,
          id: identityId
        } = operation;

        if (type !== 'remove') {
          _classPrivateFieldGet(this, _addIdentityListeners).call(this, identityId);

          return;
        }

        try {
          await _classPrivateFieldGet(this, _destroySessionsByIdentityId).call(this, identityId);

          _classPrivateFieldGet(this, _removeIdentityListeners).call(this, identityId);
        } catch (err) {
          console.warn(`Something went wrong destroying sessions for removed identity "${identityId}". Will retry on reload.`);
        }
      }
    });

    _handleIdentityRevoke.set(this, {
      writable: true,
      value: async identityId => {
        try {
          await _classPrivateFieldGet(this, _destroySessionsByIdentityId).call(this, identityId);
        } catch (err) {
          console.warn(`Something went wrong destroying sessions for revoked identity "${identityId}". Will retry on reload.`);
        }
      }
    });

    _handleLinkCurrentChange.set(this, {
      writable: true,
      value: async (identityId, {
        appId,
        isLinked
      }) => {
        const session = _classPrivateFieldGet(this, _getSessionByIdentityAndAppId).call(this, identityId, appId);

        if (session && !isLinked) {
          const sessionId = session.getId();

          try {
            await this.destroy(session.getId());
          } catch (err) {
            console.warn(`Something went wrong destroying session "${sessionId}" for app "${appId}" of identity "${identityId}" . Will retry on reload.`);
          }
        } else if (!session && isLinked) {
          console.warn(`App "${appId}" of identity "${identityId}" is linked but there's no session. Will fix on reload.`);
        }
      }
    });

    _classPrivateFieldSet(this, _sessions, _sessions2);

    _classPrivateFieldSet(this, _storage, storage);

    _classPrivateFieldSet(this, _identities, identities);

    _classPrivateFieldGet(this, _identities).onLoad(_classPrivateFieldGet(this, _handleIdentitiesLoad));

    _classPrivateFieldGet(this, _identities).onChange(_classPrivateFieldGet(this, _handleIdentitiesChange));
  }

  get(sessionId) {
    const session = _classPrivateFieldGet(this, _sessions)[sessionId];

    if (!session || !session.isValid(sessionId)) {
      throw new _errors.UnknownSessionError(sessionId);
    }

    return session;
  }

  isValid(sessionId) {
    const session = _classPrivateFieldGet(this, _sessions)[sessionId];

    return Boolean(session && session.isValid());
  }

  async create(identityId, app, options) {
    (0, _identities2.assertApp)(app);
    (0, _session.assertSessionOptions)(options);

    const identity = _classPrivateFieldGet(this, _identities).get(identityId);

    if (identity.isRevoked()) {
      throw new _errors.IdentityRevokedError(`Unable to create session for revoked identity: ${identityId}`);
    }

    const session = _classPrivateFieldGet(this, _getSessionByIdentityAndAppId).call(this, identityId, app.id);

    if (session) {
      if (session.isValid()) {
        return session;
      }

      await this.destroy(session.getId());
    }

    const newSession = await (0, _session.createSession)(identity, app, options, _classPrivateFieldGet(this, _storage), _classPrivateFieldGet(this, _identities));
    const newSessionId = newSession.getId();
    _classPrivateFieldGet(this, _sessions)[newSessionId] = newSession;

    try {
      await identity.apps.add(app);
      await identity.apps.linkCurrentDevice(app.id);
    } catch (err) {
      delete _classPrivateFieldGet(this, _sessions)[newSessionId];

      try {
        await (0, _session.removeSession)(newSessionId, _classPrivateFieldGet(this, _storage)).catch(() => {});
      } catch (err) {
        console.warn(`Unable to remove session "${newSessionId}" after failed attempt to create app "${app.id}" or link it to "${identityId}". Will cleanup on when identities got loaded again.`, err);
      }

      throw err;
    }

    return newSession;
  }

  async destroy(sessionId) {
    const session = _classPrivateFieldGet(this, _sessions)[sessionId];

    if (!session) {
      return;
    }

    await (0, _session.removeSession)(sessionId, _classPrivateFieldGet(this, _storage));
    delete _classPrivateFieldGet(this, _sessions)[sessionId];
    const appId = session.getAppId();
    const identityId = session.getIdentityId();

    if (_classPrivateFieldGet(this, _identities).isLoaded() && _classPrivateFieldGet(this, _identities).has(identityId)) {
      const identity = _classPrivateFieldGet(this, _identities).get(identityId);

      try {
        await identity.apps.unlinkCurrentDevice(appId);
      } catch (err) {
        console.warn(`Something went wrong unlinking current device with app "${appId}" for identity "${identityId}". Will retry on reload.`, err);
      }
    }

    _classPrivateFieldGet(this, _onDestroy).dispatch(sessionId, session.getMeta());
  }

  onDestroy(fn) {
    return _classPrivateFieldGet(this, _onDestroy).add(fn);
  }

}

var _sessions = new WeakMap();

var _storage = new WeakMap();

var _identities = new WeakMap();

var _identityListeners = new WeakMap();

var _onDestroy = new WeakMap();

var _getSessionByIdentityAndAppId = new WeakMap();

var _getSessionsByIdentityId = new WeakMap();

var _destroySessionsByIdentityId = new WeakMap();

var _addIdentityListeners = new WeakMap();

var _removeIdentityListeners = new WeakMap();

var _handleIdentitiesLoad = new WeakMap();

var _handleIdentitiesChange = new WeakMap();

var _handleIdentityRevoke = new WeakMap();

var _handleLinkCurrentChange = new WeakMap();

const createSessions = async (storage, identities) => {
  const sessions = await (0, _session.loadSessions)(storage);
  return new Sessions(sessions, storage, identities);
};

var _default = createSessions;
exports.default = _default;
module.exports = exports.default;