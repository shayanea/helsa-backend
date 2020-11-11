const ZarinpalCheckout = require("zarinpal-checkout");
const zarinpal = ZarinpalCheckout.create(
  "1fdb4262-8955-11e9-aeb9-000c29344814"
);

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
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
    const result = await strapi.services.payment.create({
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
    return ctx.send(zarinResult);
  },
  validate: async (ctx, next) => {
    const result = await strapi.services.payment.find({
      _id: ctx.request.body.id,
    });
    const zarinResult = await zarinpal
      .PaymentVerification({
        Authority: ctx.request.body.authority,
        Amount: findPackagePriceById(result.packageId).price,
      })
      .then((response) => {
        if (response.status !== 100) {
          console.log("Empty!");
        } else {
          console.log(`Verified! Ref ID: ${response.RefID}`);
        }
        strapi.services.payment.update(
          { _id: ctx.request.body.id },
          {
            authority: ctx.request.body.authority,
            refId: response.RefID,
            status: response.status,
          }
        );
        return { ...response, packageId: result.packageId };
      })
      .catch((err) => {
        return err;
      });

    return ctx.send(zarinResult);
  },
};
