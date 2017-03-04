'use strict';

module.exports = {
  isValidObjectID: function (str) {
    // A valid Object Id must be 24 hex characters
    return (/^[0-9a-fA-F]{24}$/).test(str);
  }
};
