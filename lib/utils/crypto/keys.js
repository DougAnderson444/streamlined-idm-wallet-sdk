"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateDeviceChildKeyMaterial = exports.generateDeviceKeyMaterial = void 0;

var _random2 = _interopRequireDefault(require("lodash/random"));

var _buffer = require("buffer");

var _secp256k = _interopRequireDefault(require("secp256k1"));

var _hdkey = _interopRequireDefault(require("hdkey"));

var _cryptoKeyComposer = require("crypto-key-composer");

var _random3 = _interopRequireDefault(require("./random"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SEED_LENGTH_BYTES = 512 / 8;
const SECP256K1_FIELD_SIZE = 256 / 8;

const bufferToUint8Array = buffer => new Uint8Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

const decodeEcPoint = publicKey => {
  if (publicKey[0] !== 4) {
    throw new Error('Only uncompressed EC points are supported');
  }

  if (publicKey.length !== SECP256K1_FIELD_SIZE * 2 + 1) {
    throw new Error(`Expecting EC public key to have length ${SECP256K1_FIELD_SIZE * 2 - 1}`);
  }

  return {
    x: publicKey.slice(1, SECP256K1_FIELD_SIZE + 1),
    y: publicKey.slice(SECP256K1_FIELD_SIZE + 1)
  };
};

const hdPrivateKeytoPem = hdkey => {
  const {
    privateKey,
    publicKey
  } = hdkey;

  const uncompressedPublicKey = _secp256k.default.publicKeyConvert(publicKey, false);

  const d = bufferToUint8Array(privateKey);
  const {
    x,
    y
  } = decodeEcPoint(bufferToUint8Array(uncompressedPublicKey));
  return (0, _cryptoKeyComposer.composePrivateKey)({
    format: 'raw-pem',
    keyAlgorithm: {
      id: 'ec-public-key',
      namedCurve: 'secp256k1'
    },
    keyData: {
      d,
      x,
      y
    }
  });
};

const hdPublicKeytoPem = hdkey => {
  const {
    publicKey
  } = hdkey;

  const uncompressedPublicKey = _secp256k.default.publicKeyConvert(publicKey, false);

  const {
    x,
    y
  } = decodeEcPoint(bufferToUint8Array(uncompressedPublicKey));
  return (0, _cryptoKeyComposer.composePublicKey)({
    format: 'spki-pem',
    keyAlgorithm: {
      id: 'ec-public-key',
      namedCurve: 'secp256k1'
    },
    keyData: {
      x,
      y
    }
  });
};

const generateDeviceKeyMaterial = () => {
  // Generate a hdkey instance from a new seed
  const seed = (0, _random3.default)(SEED_LENGTH_BYTES);

  const hdkey = _hdkey.default.fromMasterSeed(_buffer.Buffer.from(seed)); // Convert the key pair to pem


  const privateKeyPem = hdPrivateKeytoPem(hdkey);
  const publicKeyPem = hdPublicKeytoPem(hdkey);
  return {
    privateKeyPem,
    publicKeyPem,
    privateExtendedKeyBase58: hdkey.privateExtendedKey,
    publicExtendedKeyBase58: hdkey.publicExtendedKey
  };
};

exports.generateDeviceKeyMaterial = generateDeviceKeyMaterial;

const generateDeviceChildKeyMaterial = devicePrivateExtendedKey => {
  // Generate a hdkey instance from the private extended key
  const hdkey = _hdkey.default.fromExtendedKey(devicePrivateExtendedKey); // Derivate the child key


  const childKeyIndex = (0, _random2.default)(0, 2 ** 31 - 1);
  const childKeyPath = `m/${childKeyIndex}`;
  const childHdkey = hdkey.derive(childKeyPath);
  const privateKeyPem = hdPrivateKeytoPem(childHdkey);
  const publicKeyPem = hdPublicKeytoPem(childHdkey);
  return {
    privateKeyPem,
    publicKeyPem,
    keyPath: childKeyPath
  };
};

exports.generateDeviceChildKeyMaterial = generateDeviceChildKeyMaterial;