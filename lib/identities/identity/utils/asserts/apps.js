"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertApp = void 0;

var _errors = require("../../../../utils/errors");

const assertApp = app => {
  const {
    id,
    name,
    homepageUrl,
    iconUrl
  } = app;

  if (!id || typeof id !== 'string') {
    throw new _errors.InvalidAppPropertyError('id', id);
  }

  if (!name || typeof name !== 'string') {
    throw new _errors.InvalidAppPropertyError('name', name);
  }

  if (homepageUrl && typeof homepageUrl !== 'string') {
    throw new _errors.InvalidAppPropertyError('homepageUrl', homepageUrl);
  }

  if (iconUrl && typeof iconUrl !== 'string') {
    throw new _errors.InvalidAppPropertyError('iconUrl', iconUrl);
  }
};

exports.assertApp = assertApp;