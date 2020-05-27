"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentDeviceKey = exports.getBackupKey = exports.getDescriptorKey = exports.DESCRIPTOR_KEY_PREFIX = void 0;
const KEY_PREFIX = 'identity!';
const DESCRIPTOR_KEY_PREFIX = `${KEY_PREFIX}descriptor!`;
exports.DESCRIPTOR_KEY_PREFIX = DESCRIPTOR_KEY_PREFIX;

const getDescriptorKey = identityId => DESCRIPTOR_KEY_PREFIX + identityId;

exports.getDescriptorKey = getDescriptorKey;

const getBackupKey = identityId => `${KEY_PREFIX}backup!${identityId}`;

exports.getBackupKey = getBackupKey;

const getCurrentDeviceKey = identityId => `${KEY_PREFIX}currentDevice!${identityId}`;

exports.getCurrentDeviceKey = getCurrentDeviceKey;