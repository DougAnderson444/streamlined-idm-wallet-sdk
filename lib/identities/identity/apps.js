"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "assertApp", {
  enumerable: true,
  get: function () {
    return _asserts.assertApp;
  }
});
exports.removeApps = exports.createApps = void 0;

var _difference2 = _interopRequireDefault(require("lodash/difference"));

var _picoSignals = _interopRequireDefault(require("pico-signals"));

var _orbitdb = require("./utils/orbitdb");

var _asserts = require("./utils/asserts");

var _errors = require("../../utils/errors");

var _apps = require("./utils/constants/apps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

class Apps {
  constructor(currentDeviceId, identityDescriptor, appsStore, appsDevicesStore) {
    _currentDeviceId.set(this, {
      writable: true,
      value: void 0
    });

    _identityDescriptor.set(this, {
      writable: true,
      value: void 0
    });

    _appsStore.set(this, {
      writable: true,
      value: void 0
    });

    _appsDevicesStore.set(this, {
      writable: true,
      value: void 0
    });

    _currentDeviceAppsMap.set(this, {
      writable: true,
      value: void 0
    });

    _currentDeviceAppsList.set(this, {
      writable: true,
      value: void 0
    });

    _onChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _onLinkChange.set(this, {
      writable: true,
      value: (0, _picoSignals.default)()
    });

    _getCurrentDeviceAppKey.set(this, {
      writable: true,
      value: appId => `${appId}!${_classPrivateFieldGet(this, _currentDeviceId)}`
    });

    _parseCurrentDeviceAppKey.set(this, {
      writable: true,
      value: key => {
        const [appId, deviceId] = key.split('!');
        return {
          appId,
          deviceId
        };
      }
    });

    _updateCurrentDeviceApps.set(this, {
      writable: true,
      value: () => {
        const apps = { ..._classPrivateFieldGet(this, _appsStore).all
        };
        const appsDevices = { ..._classPrivateFieldGet(this, _appsDevicesStore).all
        };
        const currentDeviceAppsMap = Object.keys(appsDevices).reduce((acc, key) => {
          const {
            appId,
            deviceId
          } = _classPrivateFieldGet(this, _parseCurrentDeviceAppKey).call(this, key);

          const app = apps[appId];

          if (app && deviceId === _classPrivateFieldGet(this, _currentDeviceId)) {
            acc[appId] = app;
          }

          return acc;
        }, {});

        _classPrivateFieldSet(this, _currentDeviceAppsMap, currentDeviceAppsMap);

        _classPrivateFieldSet(this, _currentDeviceAppsList, Object.values(_classPrivateFieldGet(this, _currentDeviceAppsMap)));

        _classPrivateFieldGet(this, _onChange).dispatch(_classPrivateFieldGet(this, _currentDeviceAppsList), _classPrivateFieldGet(this, _identityDescriptor).id);
      }
    });

    _dispatchLinkCurrentChange.set(this, {
      writable: true,
      value: (appId, isLinked) => {
        _classPrivateFieldGet(this, _onLinkChange).dispatch({
          appId,
          deviceId: this.currentDeviceId,
          isLinked
        });
      }
    });

    _handleAppsStoreWrite.set(this, {
      writable: true,
      value: () => {
        _classPrivateFieldGet(this, _updateCurrentDeviceApps).call(this);
      }
    });

    _handleAppsDevicesStoreWrite.set(this, {
      writable: true,
      value: (store, {
        payload
      }) => {
        const {
          op,
          key
        } = payload;

        const {
          appId,
          deviceId
        } = _classPrivateFieldGet(this, _parseCurrentDeviceAppKey).call(this, key);

        _classPrivateFieldGet(this, _updateCurrentDeviceApps).call(this);

        if (deviceId === _classPrivateFieldGet(this, _currentDeviceId)) {
          if (op === 'PUT') {
            _classPrivateFieldGet(this, _dispatchLinkCurrentChange).call(this, appId, true);
          } else if (op === 'DEL') {
            _classPrivateFieldGet(this, _dispatchLinkCurrentChange).call(this, appId, false);
          }
        }
      }
    });

    _handleStoreReplication.set(this, {
      writable: true,
      value: () => {
        const previousLinkedApps = Object.keys(_classPrivateFieldGet(this, _currentDeviceAppsMap));

        _classPrivateFieldGet(this, _updateCurrentDeviceApps).call(this);

        const currentLinkedApps = Object.keys(_classPrivateFieldGet(this, _currentDeviceAppsMap));
        const links = (0, _difference2.default)(currentLinkedApps, previousLinkedApps);
        const unlinks = (0, _difference2.default)(previousLinkedApps, currentLinkedApps);
        links.forEach(appId => _classPrivateFieldGet(this, _dispatchLinkCurrentChange).call(this, appId, true));
        unlinks.forEach(appId => _classPrivateFieldGet(this, _dispatchLinkCurrentChange).call(this, appId, false));
      }
    });

    _classPrivateFieldSet(this, _currentDeviceId, currentDeviceId);

    _classPrivateFieldSet(this, _identityDescriptor, identityDescriptor);

    _classPrivateFieldSet(this, _appsStore, appsStore);

    _classPrivateFieldSet(this, _appsDevicesStore, appsDevicesStore);

    _classPrivateFieldGet(this, _appsStore).events.on('write', _classPrivateFieldGet(this, _handleAppsStoreWrite));

    _classPrivateFieldGet(this, _appsStore).events.on('replicated', _classPrivateFieldGet(this, _handleStoreReplication));

    _classPrivateFieldGet(this, _appsDevicesStore).events.on('write', _classPrivateFieldGet(this, _handleAppsDevicesStoreWrite));

    _classPrivateFieldGet(this, _appsDevicesStore).events.on('replicated', _classPrivateFieldGet(this, _handleStoreReplication));

    _classPrivateFieldGet(this, _updateCurrentDeviceApps).call(this);
  }

  list() {
    return _classPrivateFieldGet(this, _currentDeviceAppsList);
  }

  has(appId) {
    return Boolean(_classPrivateFieldGet(this, _currentDeviceAppsMap)[appId]);
  }

  get(appId) {
    if (!_classPrivateFieldGet(this, _currentDeviceAppsMap)[appId]) {
      throw new _errors.UnknownAppError(appId);
    }

    return _classPrivateFieldGet(this, _currentDeviceAppsMap)[appId];
  }

  async add(app) {
    (0, _asserts.assertApp)(app);
    await _classPrivateFieldGet(this, _appsStore).put(app.id, app);
  }

  async revoke(appId) {
    const appsDevicesKeys = Object.keys(_classPrivateFieldGet(this, _appsDevicesStore).all);
    const filteredKeys = appsDevicesKeys.filter(key => _classPrivateFieldGet(this, _parseCurrentDeviceAppKey).call(this, key).appId === appId);
    await Promise.all(filteredKeys.map(key => _classPrivateFieldGet(this, _appsDevicesStore).del(key)));
    await _classPrivateFieldGet(this, _appsStore).del(appId);
  }

  async linkCurrentDevice(appId) {
    if (!_classPrivateFieldGet(this, _appsStore).get(appId)) {
      throw new _errors.UnknownAppError(appId);
    }

    const key = _classPrivateFieldGet(this, _getCurrentDeviceAppKey).call(this, appId);

    if (_classPrivateFieldGet(this, _appsDevicesStore).get(key)) {
      return;
    }

    await _classPrivateFieldGet(this, _appsDevicesStore).put(key, true);
  }

  async unlinkCurrentDevice(appId) {
    const key = _classPrivateFieldGet(this, _getCurrentDeviceAppKey).call(this, appId);

    if (!_classPrivateFieldGet(this, _appsDevicesStore).all[key]) {
      return;
    }

    await _classPrivateFieldGet(this, _appsDevicesStore).del(key);
  }

  onChange(fn) {
    return _classPrivateFieldGet(this, _onChange).add(fn);
  }

  onLinkCurrentChange(fn) {
    return _classPrivateFieldGet(this, _onLinkChange).add(fn);
  }

}

var _currentDeviceId = new WeakMap();

var _identityDescriptor = new WeakMap();

var _appsStore = new WeakMap();

var _appsDevicesStore = new WeakMap();

var _currentDeviceAppsMap = new WeakMap();

var _currentDeviceAppsList = new WeakMap();

var _onChange = new WeakMap();

var _onLinkChange = new WeakMap();

var _getCurrentDeviceAppKey = new WeakMap();

var _parseCurrentDeviceAppKey = new WeakMap();

var _updateCurrentDeviceApps = new WeakMap();

var _dispatchLinkCurrentChange = new WeakMap();

var _handleAppsStoreWrite = new WeakMap();

var _handleAppsDevicesStoreWrite = new WeakMap();

var _handleStoreReplication = new WeakMap();

const loadOrbitdbStores = async orbitdb => {
  const appsStore = await (0, _orbitdb.loadStore)(orbitdb, _apps.ORBITDB_APPS_STORE_NAME, _apps.ORBITDB_STORE_TYPE);
  const appsDevicesStore = await (0, _orbitdb.loadStore)(orbitdb, _apps.ORBITDB_APPS_DEVICES_STORE_NAME, _apps.ORBITDB_STORE_TYPE);
  await appsStore.load();
  await appsDevicesStore.load();
  return {
    appsStore,
    appsDevicesStore
  };
};

const createApps = async (currentDeviceId, identityDescriptor, orbitdb) => {
  const {
    appsStore,
    appsDevicesStore
  } = await loadOrbitdbStores(orbitdb, identityDescriptor.id);
  return new Apps(currentDeviceId, identityDescriptor, appsStore, appsDevicesStore);
};

exports.createApps = createApps;

const removeApps = async (identityDescriptor, orbitdb) => {
  await (0, _orbitdb.dropStore)(orbitdb, _apps.ORBITDB_APPS_STORE_NAME, _apps.ORBITDB_STORE_TYPE);
  await (0, _orbitdb.dropStore)(orbitdb, _apps.ORBITDB_APPS_DEVICES_STORE_NAME, _apps.ORBITDB_STORE_TYPE);
};

exports.removeApps = removeApps;