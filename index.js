'use strict';

const crypto = require('crypto');

class CryptoObject {
  constructor(options = {}) {
    if (!options.password) {
      throw new Error('No password provided');
    }

    if (options.keys.length === 0) {
      throw new Error('No keys array provided');
    }

    this.options = Object.assign({}, options, {
      algorithm: 'aes-256-ctr'
    });
  }

  encrypt(obj) {
    return this._applyFunctionToKeys(obj, this._encryptText.bind(this));
  }

  decrypt(obj) {
    return this._applyFunctionToKeys(obj, this._decryptText.bind(this));
  }

  _applyFunctionToKeys(obj, fn) {
    return Object.keys(obj).reduce((newObj, key) => {
      const value = obj[key];

      newObj[key] = this._shouldEncryptValue(key, value) ? fn(value) : value;

      return newObj;
    }, {});
  }

  _encryptText(plaintext) {
    const cipher = crypto.createCipheriv(this.options.algorithm, this.options.password, null);

    let crypted = cipher.update(plaintext, 'utf8', 'hex');
    crypted += cipher.final('hex');

    return crypted;
  }

  _decryptText(ciphertext) {
    const decipher = crypto.createDecipheriv(this.options.algorithm, this.options.password, null);

    let dec = decipher.update(ciphertext, 'hex', 'utf8');
    dec += decipher.final('utf8');

    return dec;
  }

  _shouldEncryptValue(key, value = null) {
    const shouldEncryptThisKey = this.options.keys.includes(key);
    const isString = typeof value === 'string';

    return value && shouldEncryptThisKey && isString;
  }
}

module.exports = CryptoObject;
