"use strict";
const axios = require("axios");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

let KAVENEGAR_API_KEY =
  "693374326C6E467753524A637376716B724C63413767784F705853374F736C33574A78694A6843677737633D";

module.exports = {
  sendSMS: async (verifyCode, mobileNumber) => {
    await axios.post(
      `https://api.kavenegar.com/v1/${KAVENEGAR_API_KEY}/verify/lookup.json?receptor=${mobileNumber}&token=${verifyCode}&template=verify`
    );
  },
};
