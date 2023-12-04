const mongoose = require('mongoose')
require('../db/config')
// let product=mongoose.model('bulkdatas')
const productSchema = mongoose.Schema({
  productId: String,
  title: String,
  vendor: String,
  product_type: String,
  price: Number,
  description: String
}, {
  timestamps: true
})



let Users
try {
  Users = mongoose.model('products')
} catch (error) {
  Users = mongoose.model('products', productSchema)
}

const asd = mongoose.Schema({
  admin_graphql_api_id: String,
  completed_at: String,
  created_at: String,
  error_code: String,
  status: String,
  type: String,
}, {
  timestamps: true
})


let Bulk
try {
  Bulk = mongoose.model('bulkupoads')
} catch (error) {
  Bulk = mongoose.model('bulkupoads', asd)
}


// export const BulkUpload= mongoose.model('bulkupoads') || mongoose.model('bulkupoads',asd)
module.exports.Bulkimport = Bulk
// mongoose.model('bulkupoads') || mongoose.model('bulkupoads', asd)
module.exports.Product = Users

