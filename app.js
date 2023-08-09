const Koa = require('koa');
const app = new Koa();

const mongoose = require('./database/index.js');
// 定义SCHEMA 每个schema都会映射一个collection
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: String,
  content: String,
  show: Boolean,
  tag: Array,
  // categories: Array,
  categories: [{ type: Schema.Types.ObjectId, ref: 'Categories' }],
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

const categoriesSchema = new Schema({
  name: String,
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

const Article = mongoose.model('Article', articleSchema);
const Categories = mongoose.model('Categories', categoriesSchema);

// 启动服务
// 监听7200端口
app.listen(7200, () => {
  console.log('[Koa] Server is starting at port 7200!');
});

app.use(async ctx => {

  if (ctx.request.path === '/api/article/all') {
    const {
      pageSize = 20,
      pageNo = 1,
      isShowInvalid = false, // 是否显示失效数据
    } = JSON.parse(await parsePostData(ctx));
    const allData = await Article.count()
    const data = await Article.find({}).
      where('show').in(isShowInvalid ? [true, false] : [true]).
      skip((pageNo - 1) * pageSize).
      limit(pageSize).
      populate('categories').
      sort('-created')
    ctx.body = {
      code: 200,
      data: {
        list: data || [],
        total: allData || 0
      },
      message: 'success'
    }
    return;
  };

  if (ctx.request.path === '/api/article/create') {
    const obj = await parsePostData(ctx);
    const {
      title,
      content
    } = JSON.parse(obj);
    // 这里添加保存的其他属性
    const article = new Article({
      title,
      content,
      show: true
    });
    let repErr = null;
    console.log('save:' + title)
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

  if (ctx.request.path === '/api/article/getDetail') {
    const { _id
    } = JSON.parse(await parsePostData(ctx));
    const data = await Article.findOne({ _id })
      .populate('categories')
    ctx.body = {
      code: 200,
      data,
      message: 'success'
    }
    return;
  }



  if (ctx.request.path === '/api/category/all') {
    const {
      pageSize = 20,
      pageNo = 1
    } = JSON.parse(await parsePostData(ctx));
    const allData = await Categories.count()
    const data = await Categories.find((err, item) => {
      return item;
    }).skip((pageNo - 1) * pageSize).limit(pageSize).sort('-created')
    ctx.body = {
      code: 200,
      data: {
        list: data || [],
        total: allData || 0
      },
      message: 'success'
    }
    return;
  };


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
