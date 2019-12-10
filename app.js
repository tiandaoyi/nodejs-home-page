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

// 启动服务
// 监听3001端口
app.listen(3001, () => {
  console.log('[Koa] Server is starting at port 3001!');
});

app.use(async ctx => {
  // 文章model
  const Article = mongoose.model('article', articleSchema);
  if (ctx.request.path === '/api/article/all') {
    const data = await Article.find((err, article) => {
      return article;
    });
    ctx.body = {
      code: 200,
      data,
      message: null
    }
    return;
  };

  if (ctx.request.path === '/api/article/create') {
    const obj = await parsePostData(ctx);
    const {
      title,
      content
    } = JSON.parse(obj);
    const article = new Article({
      title,
      content
    });
    console.log('58')
    let repErr = null;
    await article.save();
    ctx.body = {
      code: 200,
      message: '保存成功'
    };
    return;
  }

  if (ctx.request.path === '/api/article/update') {
    const obj = await parsePostData(ctx);
    const {
      _id,
      title,
      content
    } = JSON.parse(obj);
    Article.findById(_id, (err, article) => {
      if (err) return err;
      article.set({
        title,
        content
      });
      article.save();
      console.log('82');
    });
    console.log('84');
    ctx.body = {
      code: 200,
      message: '更新成功'
    };
  }

  if (ctx.request.path === '/api/article/delete') {
    const obj = await parsePostData(ctx);
    const {
      _id,
} = JSON.parse(obj);
console.log('97', _id);
    const res = Article.find({_id}).remove().exec();
    console.log('84', res.deletedCount);
    ctx.body = {
      code: 200,
      message: '删除成功'
    };
  }

  console.log('68', ctx.body);
});

// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = '';
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener('end', function() {
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
