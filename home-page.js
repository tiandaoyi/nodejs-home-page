const Koa = require('koa');
const app = new Koa();
// Router = require('koa-router');
 
// 连接数据库
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27027/home";


app.use(async ctx => {
  if (ctx.request.path === '/api/article/all') {
    const article = await getArticle();
    console.log('article,', article);
    ctx.body = 'article';
  }
});

function getArticle() {
  MongoClient.connect(url, {
    useNewUrlParser: true
  }, (err, db) => {
    if (err) {
      throw err
    }
    console.log('数据库已经创建');
    const dbase = db.db("home");
    dbase.createCollection('article', (dberr, res) => {
      if (dberr) {
        throw dberr;
      }
      console.log('创建集合');

    });
    const myobj = {
      name: '菜鸟教程',
      url: 'www.runoob'
    }
    dbase.collection('article').insertOne(myobj, (dberr, res) => {
      if (err) throw err;
      console.log('文档插入成功');

    });
    dbase.collection('article').find({}).toArray((dberr, res) => {

      if (err) throw err;
      console.log(res);
      return res;

      db.close();
    });
  });

}

app.listen(3001);
