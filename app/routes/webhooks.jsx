import { authenticate } from "../shopify.server";
// import db from "../db.server";
console.log('webhook....')

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );
  console.log("aya pochii gayu");
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      console.log('APP_UNINSTALLED called..')
      // if (session) {
      //   await db.session.deleteMany({ where: { shop } });
      // }
      console.log("nidhi");
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    case "PRODUCTS_CREATE":
      console.log('PRODUCTS_CREATE webhook called...', payload)

      
      break
    case "CUSTOMERS_CREATE":
      console.log('CUSTOMERS_CREATE webhook called...', payload)
      break
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
