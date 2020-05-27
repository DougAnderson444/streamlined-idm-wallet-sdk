"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEncrypted = exports.decrypt = exports.encrypt = exports.generateCypherKey = exports.KEY_LENGTH = exports.ALGORITHM_NAME = void 0;

var _hexArray = _interopRequireDefault(require("hex-array"));

var _random = _interopRequireDefault(require("./random"));

var _crypto = require("../errors/crypto");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ALGORITHM_NAME = 'AES-GCM';
exports.ALGORITHM_NAME = ALGORITHM_NAME;
const KEY_LENGTH = 256 / 8;
exports.KEY_LENGTH = KEY_LENGTH;

const toHex = encryptedData => ({ ...encryptedData,
  cypherText: _hexArray.default.toString(encryptedData.cypherText, {
    uppercase: false
  }),
  iv: _hexArray.default.toString(encryptedData.iv, {
    uppercase: false
  })
});

const fromHex = encryptedData => ({ ...encryptedData,
  cypherText: _hexArray.default.fromString(encryptedData.cypherText),
  iv: _hexArray.default.fromString(encryptedData.iv)
});

const generateCypherKey = () => (0, _random.default)(KEY_LENGTH);

exports.generateCypherKey = generateCypherKey;

const encrypt = async (data, key, hex = false) => {
  const algorithm = ALGORITHM_NAME; // As per the AES publication, IV should be 12 bytes for GCM
  // See https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf, page 15

  const iv = (0, _random.default)(12);
  const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['encrypt']);
  const cypherText = await crypto.subtle.encrypt({
    name: algorithm,
    iv
  }, cryptoKey, data);
  let encryptedData = {
    algorithm: ALGORITHM_NAME,
    cypherText: new Uint8Array(cypherText),
    iv
  };

  if (hex) {
    encryptedData = toHex(encryptedData);
  }

  return encryptedData;
};

exports.encrypt = encrypt;

const decrypt = async (encryptedData, key) => {
  if (typeof encryptedData.cypherText === 'string') {
    encryptedData = fromHex(encryptedData);
  }

  const {
    algorithm,
    cypherText,
    iv
  } = encryptedData;

  if (algorithm !== ALGORITHM_NAME) {
    throw new _crypto.UnsupportedCypherAlgorithm(algorithm);
  }

  const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['decrypt']);
  const decryptedValue = await crypto.subtle.decrypt({
    name: algorithm,
    iv
  }, cryptoKey, cypherText);
  return new Uint8Array(decryptedValue);
};

exports.decrypt = decrypt;

const isEncrypted = encryptedData => Boolean(encryptedData && encryptedData.algorithm && encryptedData.cypherText && encryptedData.iv);

exports.isEncrypted = isEncrypted;