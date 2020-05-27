"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDid = exports.parseDidUrl = exports.parseDid = void 0;

var _didUri = _interopRequireDefault(require("did-uri"));

var _did = require("./errors/did");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parseDid = did => {
  let parsed;

  try {
    parsed = _didUri.default.parse(did);
  } catch (err) {
    throw new _did.InvalidDidError(err.message);
  }

  if (parsed.did !== did) {
    throw new _did.InvalidDidError(`It seems that ${did} is a DID URL and not a DID`);
  }

  return parsed;
};

exports.parseDid = parseDid;

const parseDidUrl = did => {
  let parsed;

  try {
    parsed = _didUri.default.parse(did);
  } catch (err) {
    throw new _did.InvalidDidUrlError(err.message);
  }

  return parsed;
};

exports.parseDidUrl = parseDidUrl;

const formatDid = parts => {
  try {
    return _didUri.default.format(parts);
  } catch (err) {
    throw new _did.InvalidDidParts(err.message);
  }
};

exports.formatDid = formatDid;