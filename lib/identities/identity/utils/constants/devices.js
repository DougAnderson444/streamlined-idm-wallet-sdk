"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DESCRIPTOR_SENSITIVE_KEYS = exports.DEVICE_TYPES = exports.DID_PUBLIC_KEY_PREFIX = exports.ORBITDB_STORE_TYPE = exports.ORBITDB_STORE_NAME = void 0;
// Orbit DB
const ORBITDB_STORE_NAME = 'devices';
exports.ORBITDB_STORE_NAME = ORBITDB_STORE_NAME;
const ORBITDB_STORE_TYPE = 'keyvalue'; // DID Document Key

exports.ORBITDB_STORE_TYPE = ORBITDB_STORE_TYPE;
const DID_PUBLIC_KEY_PREFIX = 'idm-device-'; // Device Properties

exports.DID_PUBLIC_KEY_PREFIX = DID_PUBLIC_KEY_PREFIX;
const DEVICE_TYPES = ['phone', 'tablet', 'laptop', 'desktop']; // Keys in the descriptor that are consired sensitive and must not be replicated

exports.DEVICE_TYPES = DEVICE_TYPES;
const DESCRIPTOR_SENSITIVE_KEYS = ['keyMaterial.privateKeyPem', 'keyMaterial.privateKeyBase58', 'keyMaterial.privateExtendedKeyBase58'];
exports.DESCRIPTOR_SENSITIVE_KEYS = DESCRIPTOR_SENSITIVE_KEYS;