const Koa = require('koa');
const app = new Koa();

const router = require('koa-router');
const mongoose = require('./database/index.js');
// 定义SCHEMA 每个schema都会映射一个collection
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: String,
  author: String,
  body: String,
  createTime: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

//const articleOne = new Article({
//  title: '大数据是什么'
//});
//console.log('27', articleOne);

// Article.),
//mongoose.connection.on('open', (res) => {
//  console.log('28', res);
//  // 查找数据
//});
// 启动服务
// 监听3001端口
app.listen(3001, () => {
  console.log('[Koa] Server is starting at port 3001!');
});

app.use(async ctx => {
  if (ctx.request.path === '/api/article/all') {
    console.log('53')
    const Article = mongoose.model('article1', articleSchema);
    //const article1 = new Article({
    //      title: 'hhhhh'
    //   });
    //article1.save((err, article) => {
    //          console.log('article:34', article);

    //})
    ctx.body = await Article.find((err, article) => {
      console.log('article:35', article);
      return article;
    });
  };

  //    const article = await getArticle();
  //    console.log('article,', article);
  //    ctx.body = 'article';
});
