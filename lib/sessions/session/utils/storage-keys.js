"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSessionKey = exports.DESCRIPTOR_KEY_PREFIX = void 0;
const DESCRIPTOR_KEY_PREFIX = 'session!';
exports.DESCRIPTOR_KEY_PREFIX = DESCRIPTOR_KEY_PREFIX;

const getSessionKey = sessionId => `${DESCRIPTOR_KEY_PREFIX}${sessionId}`;

exports.getSessionKey = getSessionKey;