"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertNonMandatoryProfileProperty = exports.assertProfileDetails = exports.assertProfileProperty = void 0;

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _profile = require("../constants/profile");

var _errors = require("../../../../utils/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const assertProfileProperty = (key, value) => {
  switch (key) {
    case '@context':
      if (value !== 'https://schema.org') {
        throw new _errors.InvalidProfilePropertyError(key, value);
      }

      break;

    case '@type':
      if (!_profile.PROFILE_TYPES.includes(value)) {
        throw new _errors.InvalidProfilePropertyError(key, value);
      }

      break;

    case 'name':
      if (typeof value !== 'string' || !value.trim()) {
        throw new _errors.InvalidProfilePropertyError(key, value);
      }

      break;

    case 'image':
      {
        if (!(0, _isPlainObject2.default)(value)) {
          throw new _errors.InvalidProfilePropertyError(key, value);
        }

        const {
          type,
          data,
          ...rest
        } = value;

        if (typeof type !== 'string') {
          throw new _errors.InvalidProfilePropertyError(`${key}.type`, type);
        }

        const typeParts = type.split('/');

        if (typeParts.length !== 2 || typeParts[0] !== 'image') {
          throw new _errors.InvalidProfilePropertyError(`${key}.type`, type);
        }

        if (!(data instanceof ArrayBuffer)) {
          throw new _errors.InvalidProfilePropertyError(`${key}.data`, data);
        }

        const otherProps = Object.keys(rest);

        if (otherProps.length) {
          throw new _errors.UnsupportedProfilePropertyError(`${key}.${otherProps[0]}`);
        }

        break;
      }

    case 'gender':
      {
        if (!['Male', 'Female', 'Other'].includes(value)) {
          throw new _errors.InvalidProfilePropertyError(key, value);
        }

        break;
      }

    case 'nationality':
    case 'address':
      {
        if (typeof value !== 'string' || !value.trim()) {
          throw new _errors.InvalidProfilePropertyError(key, value);
        }

        break;
      }

    default:
      throw new _errors.UnsupportedProfilePropertyError(key);
  }
};

exports.assertProfileProperty = assertProfileProperty;

const assertProfileDetails = details => {
  _profile.PROFILE_MANDATORY_PROPERTIES.forEach(property => {
    const value = details && details[property];

    if (value === undefined) {
      throw new _errors.InvalidProfilePropertyError(property, value);
    }
  });

  Object.entries(details).forEach(([key, value]) => assertProfileProperty(key, value));
};

exports.assertProfileDetails = assertProfileDetails;

const assertNonMandatoryProfileProperty = key => {
  if (_profile.PROFILE_MANDATORY_PROPERTIES.includes(key)) {
    throw new _errors.InvalidProfileMandatoryPropertyError(key);
  }
};

exports.assertNonMandatoryProfileProperty = assertNonMandatoryProfileProperty;