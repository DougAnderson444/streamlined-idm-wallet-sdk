"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _secret = _interopRequireDefault(require("./secret"));

var _didm = _interopRequireDefault(require("./didm"));

var _storage = _interopRequireDefault(require("./storage"));

var _identities = _interopRequireDefault(require("./identities"));

var _sessions = _interopRequireDefault(require("./sessions"));

var _locker = _interopRequireDefault(require("./locker"));

var _errors = require("./utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createIpfs = async ipfs => {
  if (ipfs) {
    if (typeof ipfs.isOnline === "function" && !ipfs.isOnline()) {
      throw new _errors.UnavailableIpfsError();
    }

    return ipfs;
  }
};

const createWallet = async options => {
  options = {
    ipfs: undefined,
    ...options
  };
  const ipfs = await createIpfs(options.ipfs);
  const secret = (0, _secret.default)(); // Secret Object

  const didm = (0, _didm.default)(ipfs); // creates IPID methods

  const storage = await (0, _storage.default)(secret); // LevelDB with encrypt wrapper

  const identities = (0, _identities.default)(storage, didm, ipfs); // OrbitDB

  const sessions = await (0, _sessions.default)(storage, identities);
  const locker = await (0, _locker.default)(storage, secret);
  const idmWallet = {
    ipfs,
    didm,
    storage,
    locker,
    identities,
    sessions
  }; // Expose a global for the idm wallet for debug purposes only in DEV

  if (process.env.NODE_ENV === "development") {
    window.__IDM_WALLET__ = idmWallet;
  }

  return idmWallet;
};

var _default = createWallet;
exports.default = _default;
module.exports = exports.default;