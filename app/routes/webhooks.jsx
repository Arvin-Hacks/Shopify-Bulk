import { authenticate } from "../shopify.server";
import { BulkImportEntry, AddProduct } from '../api/DBquery.server'
// import db from "../db.server";
console.log('webhook....')

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );
  console.log('topics', topic)
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      console.log('APP_UNINSTALLED called..')

      // console.log("nidhi");
      break;
    case "SHOP_UPDATE":
      console.log('SHOP_UPDATE...', payload)
      break;
    case "BULK_OPERATIONS_FINISH":
      console.log('BULK_OPERATIONS_FINISH webhook called...', payload)
      // let data = { admin_graphql_api_id: 'bulkzxczc123', status: 'Completed', type: 'Mutation' }
      try {
        let response = await BulkImportUpdate(payload)
        response = await response.json()
        console.log('db response', response)
      } catch (error) {
        console.log('db response', error)
      }
      break
    case "PRODUCTS_CREATE":
      console.log('PRODUCTS_CREATE webhook called...', payload)
      const { admin_graphql_api_id, title, product_type, vendor } = payload

      let product_data = {
        title: title,
        productId: admin_graphql_api_id,
        vendor: vendor, product_type:
          product_type, price: payload.variants[0].price
      }
      try {
        let response = await AddProduct(product_data)
        response = await response.json()
        console.log('db response', response)
      } catch (error) {
        console.log('db response ', error)
      }
      break;
    case "PRODUCTS_DELETE":
      console.log('PRODUCTS_DELETE webhook...', payload)
      break
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
