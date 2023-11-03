const mongoose = require('mongoose')
require('../db/config')
// let product=mongoose.model('bulkdatas')
const productSchema = mongoose.Schema({
  productId:String,
  title: String,
  vendor: String,
  product_type:String,
  price:Number,
  description: String
})

// const asd = mongoose.Schema({
//   admin_graphql_api_id: String,
//   completed_at: String,
//   created_at: String,
//   error_code: String,
//   status: String,
//   type: String,
// })


let Users
try {
  Users = mongoose.model('bulkdatas')
} catch (error) {
  Users = mongoose.model('bulkdatas', productSchema)
}

// let Bulk
// try {
//   Bulk = mongoose.model('bulkupoads')
// } catch (error) {
//   Bulk = mongoose.model('bulkupoads', asd)
// }


// export const BulkUpload= mongoose.model('bulkupoads') || mongoose.model('bulkupoads',asd)
// module.exports.BulkUploadss = Bulk
// mongoose.model('bulkupoads') || mongoose.model('bulkupoads', asd)
module.exports.Product = Users

