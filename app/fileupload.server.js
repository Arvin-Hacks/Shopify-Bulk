// import { CurrentBulkOperation } from '../api/api.js'
// const CurrentBulkOperation1 = require('../api/api2')
// import { CurrentBulkOperation1 } from '../api/api2'
const express = require('express');
const multer = require('multer');
const cors = require('cors')
let uplaodpath = '../upload/csv'
// const { createRequestHandler } = require('@remix-run/express');
const app = express()
// const { BulkUploadss } = require('./db.server')
const { Product ,Bulkimport } = require('./db.server')


// const v=require('../upload/csv')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uplaodpath); // Set the destination folder
  },
  filename: (req, file, cb) => {
    let filenamee = file.fieldname + "-" + Date.now() + '.' + file.mimetype.split('/').pop();
    cb(null, filenamee); // Use the original filename
  },
});

const upload = multer({ storage })

// Serve static files (if needed)
app.use(express.static('public'), cors(), express.json());

// Use the Remix request handler
// app.all(
//   '*',
//   createRequestHandler({
//     getLoadContext() {
//       // You can add context data for your loaders here
//       return {};
//     },
//   })
// );

// Define a route to handle file uploads
app.post('/upload', upload.single('csvfile'), (req, res) => {
  console.log('upload data', req.file)
  // Handle the uploaded file and send a response
  res.send({ message: 'File uploaded successfully', filedata: req.file.filename });
  //   res.json({
  //     status: 1,
  //     code: 200,
  //     data: {
  //       originname: files.originalname,
  //       generatename: files.filename
  //     }
  //   })
});

// app.get('/test',async(req,resp)=>{
//   resp.send('test data')
// })
app.post('/', async (req) => {
  console.log('dtdt', req.body)
  // let data = new BulkUploadss(req.body)

  // let result = await data.save()
  // let curr_bulk = await CurrentBulkOperation1()
  // console.log('bulk', curr_bulk)

  // if (result.data.currentBulkOperation.status) {
  //   let urll = result.data.currentBulkOperation.url
  //   console.log('url', urll)
  // }

  // console.log('result', result)
})

app.get('/tests', async (req, res) => {

  let data = new Bulkimport({ admin_graphql_api_id: 'sdgha123' })
  let result = await data.save()

  console.log('result', result)
  res.send({ data: result, state: true })
})

app.post('/bulkdata', async (req, res) => {
  console.log('bulkdata response', req.body)
  let data = new Bulkimport(req.body)

  let result = await data.save()

  console.log('result', result)

  res.send({ data: req.body, status: true })
})

app.post('/productcreatewebhook', async (req, resp) => {
  resp.send('teggf')
  // let data = req.body
  // // console.log('new data...', data.title, data.id, data.product_type)
  // let id=data.id
  // const productdata = {
  //   title: data.title,
  //   vendor: data.vendor,
  //   product_type: data.product_type,
  // }
  // // const newData = new Product(productdata)
  // let result = await Product.updateOne({productId:id},{$set:productdata},{upsert:true})
  // console.log('db res', result)
  // console.log('pd', productdata)
  // console.log('res', req.body)
})

app.post('/temp', async (req, resp) => {
  let data = await Product.find()
  console.log('res', data)
  // resp.send.st('temp callled',data)
  resp.status(200).send(data)
})
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
