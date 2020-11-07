"use strict";
const ZarinpalCheckout = require("zarinpal-checkout");
const zarinpal = ZarinpalCheckout.create(
  "1fdb4262-8955-11e9-aeb9-000c29344814"
);
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const findPackagePriceById = (id) => {
  switch (Number(id)) {
    case 1:
      return { title: "۱ ساله", price: 54000 };
      break;
    case 2:
      return { title: "۱ ماهه", price: 7000 };
      break;
    case 3:
      return { title: "۳ ماهه", price: 16500 };
      break;
    case 4:
      return { title: "۶ ماهه", price: 30000 };
      break;
    default:
      return { title: "", price: 0 };
      break;
  }
};

module.exports = {
  pay: async (ctx, next) => {
    // const package = findPackagePriceById(ctx.request.body.packageId);
    const result = await strapi.services.payment.add({
      createDate: new Date(),
      packageId: ctx.request.body.packageId,
      userId: ctx.request.body.userId,
    });
    const zarinResult = await zarinpal
      .PaymentRequest({
        Amount: findPackagePriceById(ctx.request.body.packageId).price,
        CallbackURL: `http://helsawell.com/zarinpal?token=${ctx.request.header.authorization}&id=${result.id}`,
        Description: `خرید اشتراک ${
          findPackagePriceById(ctx.request.body.packageId).title
        }`,
        Email: "shayanaraghi@live.com",
        Mobile: "09127113556",
      })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return err;
      });

    return zarinResult;
  },
};
