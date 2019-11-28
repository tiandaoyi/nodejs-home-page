// 引入
const mongoose = require('mongoose');

// 数据库地址
const DB_ADDRESS = 'mongodb://localhost:27017/home';

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

module.exports = mongoose;
