// mongoose.js
const mongoose = require('mongoose');

// Set up the MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/bulkApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('.......');
});

// module.exports = mongoose;
