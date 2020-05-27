"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitStoreReplication = exports.dropStore = exports.loadStore = exports.openStore = exports.stopOrbitDbReplication = exports.dropOrbitDbIfEmpty = exports.dropOrbitDb = exports.getOrbitDb = void 0;

var _wrap2 = _interopRequireDefault(require("lodash/wrap"));

var _orbitDb = _interopRequireDefault(require("orbit-db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const identityIdSymbol = Symbol();
const instances = new Map();
const instancesStores = new Map();

class DummyBroker {
  async subscribe() {}

  async unsubscribe() {}

  async publish() {}

  async disconnect() {}

}

const prefixStoreName = (orbitdb, name) => {
  const identityId = orbitdb[identityIdSymbol];

  if (!identityId) {
    throw new Error('Can\'t retrieve identity id from OrbitDB');
  }

  return `${identityId}.${name}`;
};

const getOrbitDb = async (identityId, ipfs, options) => {
  let orbitdb = instances.get(identityId);

  if (orbitdb) {
    return orbitdb;
  }

  options = {
    directory: `./orbitdb-${identityId}`,
    replicate: true,
    ...options
  }; // If we don't want to replicate, create a dummy broker
  // See: https://github.com/orbitdb/orbit-db/blob/ec5102bc99cdd3a4da3a6f1b8f0f14ca59225a40/src/OrbitDB.js#L44
  // See: https://github.com/orbitdb/orbit-db-pubsub

  if (!options.replicate) {
    options.broker = DummyBroker;
  }

  orbitdb = await _orbitDb.default.createInstance(ipfs, options);
  instances.set(identityId, orbitdb);
  instancesStores.set(orbitdb, new Map()); // Wrap disconnect() in order to remove from the cache automatically

  orbitdb.disconnect = (0, _wrap2.default)(orbitdb.disconnect, async disconnect => {
    await disconnect.call(orbitdb, disconnect);
    instances.delete(identityId);
    instancesStores.delete(orbitdb);
  }); // Mark the identity id associated with this orbitdb instance

  Object.defineProperty(orbitdb, identityIdSymbol, {
    value: identityId
  });
  return orbitdb;
};

exports.getOrbitDb = getOrbitDb;

const dropOrbitDb = async orbitdb => {
  await orbitdb.keystore.destroy();
  await orbitdb.disconnect();
};

exports.dropOrbitDb = dropOrbitDb;

const dropOrbitDbIfEmpty = async orbitdb => {
  const stores = instancesStores.get(orbitdb);

  if (!stores || !stores.size) {
    await dropOrbitDb(orbitdb);
  }
};

exports.dropOrbitDbIfEmpty = dropOrbitDbIfEmpty;

const stopOrbitDbReplication = async orbitdb => {
  orbitdb._pubsub.subscribe = async () => {};

  orbitdb._pubsub.publish = async () => {};

  await orbitdb._pubsub.disconnect();
};

exports.stopOrbitDbReplication = stopOrbitDbReplication;

const openStore = async (orbitdb, name, type, options) => {
  const stores = instancesStores.get(orbitdb);

  if (!stores) {
    throw new Error('OrbitDB not created with getOrbitDb() or disconnect() was already called');
  }

  let store = stores.get(name);

  if (store) {
    return store;
  }

  const storeName = prefixStoreName(orbitdb, name);
  store = await orbitdb.open(storeName, {
    type,
    create: true,
    accessController: {
      write: ['*']
    },
    ...options
  });
  stores.set(name, store); // Wrap close() in order to remove from the stores cache automatically

  store.close = (0, _wrap2.default)(store.close, async close => {
    await close.call(store);
    stores.delete(name);
  });
  return store;
};

exports.openStore = openStore;

const loadStore = async (orbitdb, name, type, options) => {
  const store = await openStore(orbitdb, name, type, options);
  await store.load();
  return store;
};

exports.loadStore = loadStore;

const dropStore = async (orbitdb, name, type, options) => {
  // We are not sure if the DB exists phisically or not but this function is supposed to be idempotent
  // Therefore, we ensure it is removed by opening it and dropping it
  const store = await openStore(orbitdb, name, type, {
    replicate: false,
    // No need to replicate if we are going to drop it
    ...options
  });
  await store.drop();
};

exports.dropStore = dropStore;

const waitStoreReplication = (orbitdbStore, options) => {
  options = {
    timeout: 30000,
    completeCondition: () => true,
    ...options
  };
  let pendingTimeout;
  return new Promise(resolve => {
    const restartTimer = () => {
      clearTimeout(pendingTimeout);
      pendingTimeout = setTimeout(() => resolve(false), options.timeout);
    };

    restartTimer();

    if (options.completeCondition()) {
      return resolve(true);
    }

    orbitdbStore.events.on('replicate', () => restartTimer());
    orbitdbStore.events.on('replicate.progress', () => restartTimer());
    orbitdbStore.events.on('replicated', () => {
      restartTimer();
      const {
        queued,
        buffered
      } = orbitdbStore.replicationStatus; // Be sure to check if the replication is finished because OrbitDB fires `replicated` several times

      if (queued <= 0 && buffered <= 0 && options.completeCondition()) {
        resolve(true);
      }
    });
  });
};

exports.waitStoreReplication = waitStoreReplication;