const Koa = require('koa');
const app = new Koa();

// x-response-time
 
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(ctx.request.origin);
  await next();
  const ms = Date.now() - start;

  console.log('11');
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log('19');
  await next();
  console.log('20')
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

//  response

app.use(async ctx => {
  console.log('27');
  ctx.body = 'Hello world';
});

app.listen(3000);
