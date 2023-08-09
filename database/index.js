// 引入
const mongoose = require('mongoose');
// docker的URI
const uri = process.env.MONGO_URI;
// 数据库地址
const DB_ADDRESS = uri || 'mongodb://localhost:27027/home';


// 连接数据库
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true
}, err => {
  if (err) {
    console.log('[Mongoose] database connect failed!');
  } else {
    console.log('[Mongoose] database connect success!');
  }

});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
module.exports = mongoose;
