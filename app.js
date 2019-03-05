const request = require('superagent')
const cheerio = require('cheerio')
const Koa = require('koa');

const app = new Koa;

app.use(async (ctx)=>{
  const arr = []
  await new Promise(resolve =>{
    request
      .get('https://movie.douban.com/chart')

      .end((err, res) => {
        // Do something
        // console.log(res.text);
        const data = res.text;
        const $ = cheerio.load(data);
        $('.item').each((i, v) => {
          const $v = $(v);

          const obj = {
            categroy: $v.find('.DyListCover-zone').text().trim(),
            title: $v.find('.pl2 a').text().trim(),
            img: $v.find('.nbg img').prop('src'),
            per: $v.find('.pl').text().trim(),
            url: $v.find('a.nbg').prop("href"),
            num: $v.find('.star .pl').text().trim().slice(1).replace("人评价)", "")
            // num: $v.find('.DyListCover-hot').text()
          }
          // console.log($v.find('.pl2 a').text().trim())
          // console.log($v.find('.DyListCover-user').text().trim())

          arr.push(obj)
          // console.log(obj);
        })
        resolve(arr)
      });
  })
  ctx.body = arr;
})



app.listen(3000);
console.log('服务已启动在3000端口');
