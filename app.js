const Koa = require('koa');
const app = new Koa();

const router = require('koa-router');
const mongoose = require('./database/index.js');
// 定义SCHEMA 每个schema都会映射一个collection
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: String,
  author: String,
  content: String,
  hidden: Boolean,
  tag: Array,
  hot: Number,
  meta: {
    votes: Number,
    favs: Number
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
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
    const Article = mongoose.model('article', articleSchema);
    //const article1 = new Article({
    //      title: 'hhhhh'
    //   });
    //article1.save((err, article) => {
    //          console.log('article:34', article);

    //})
    const data = await Article.find((err, article) => {
      console.log('article:35', article);
      return article;
    });
    ctx.body = {
      code: 200,
      data,
      message: null
    }
  };
  if (ctx.request.path === '/api/article/create') {
    const Article = mongoose.model('article', articleSchema);
    const obj = await parsePostData(ctx);
    const {
      title,
      content
    } = JSON.parse(obj);
console.log('71', obj);
//for(let o of obj) {
//console.log('73');
//console.log(o);
//}
console.log('76', JSON.parse(obj)['title']);
    console.log('content', content);
    const article = new Article({
      title,
      content
    });
    const data = await article.save((err, article, numAffected) => {
      console.log('83', err);
      console.log('84', article);
      console.log('85', numAffected);
      return article;
    });
    console.log('87', data);
    ctx.body = {
      code: 200,
      data,
      message: null
    }

  }

  //    const article = await getArticle();
  //    console.log('article,', article);
  //    ctx.body = 'article';
});
// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end", function() {
        //let parseData = parseQueryStr(postdata)
        resolve(postdata);
      })
    } catch (err) {
      reject(err)
    }
  })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr(queryStr) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log(queryStrList)
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split('=')
    queryData[itemList[0]] = decodeURIComponent(itemList[1])
  }
  return queryData
}
