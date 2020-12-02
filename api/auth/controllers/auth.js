"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  sendCode: async (ctx, next) => {
    const { mobileNumber } = ctx.request.body;
    // Check if mobileNumber is validate
    if (mobileNumber) {
      const user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetch({ mobileNumber });
      // Check if user exist
      if (user) {
        let code = Math.floor(100000 + Math.random() * 900000).toString();
        try {
          await strapi.services.code.create({
            user: user._id,
            code,
          });
          await strapi.services.auth.sendSMS(code, mobileNumber);
          return ctx.send({ send: true });
        } catch (err) {
          console.log(err);
          return ctx.badRequest();
        }
      } else {
        return ctx.badRequest();
      }
    }
    // If Mobilenumber is not valid
    return ctx.badRequest();
  },
  verifyCode: async (ctx) => {
    const { code } = ctx.request.body;
    // Check if code is correct and not expired
    if (code) {
      let result = await strapi.services.code.findOne({ code });
      if (result) {
        return ctx.send({
          jwt: strapi.plugins["users-permissions"].services.jwt.issue({
            id: result.user._id,
          }),
        });
      }
      return ctx.badRequest();
    }
    return ctx.badRequest();
  },
};
