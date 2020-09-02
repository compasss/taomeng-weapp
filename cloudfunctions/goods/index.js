// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command;
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = null
  let total = 0
  if(event.api === 'list') {
    let skip = event.page ? (event.page - 1) * event.pageSize : 0
    let limit = event.pageSize || 10

    let dbMatch = {
      status: _.in(['init', 'pending'])
    }

    if (event.query) {
      dbMatch.title = new db.RegExp({
        regexp: '.*',
        options: 'g'
      })
    }

    let { list } = await db.collection('goods_list')
    .aggregate()
    .project({
      "create_time": $.dateToString({
        date: '$create_time',
        format: '%Y-%m-%d'
      }),
      "entry": 1,
      "main_pic": 1,
      "origin_price": 1,
      "pic_list": 1,
      "platform":1,
      "price": 1,
      "status": 1,
      "title": 1
    })
    .match(dbMatch)
    .sort({
      'create_time': -1
    })
    .skip(skip)
    .limit(limit)
    .end();

    let count = await db.collection('goods_list')
      .where({
        status: _.in(['init', 'pending'])
      })
      .count()
    result = list;
    total = count.total;
  }

  if (event.api === 'one') {
    result = await db.collection('goods_list')
      .where({
        _id: _.eq(event.id)
      }).get();
  }

  return {
    'openid': wxContext.OPENID,
    'appid': wxContext.APPID,
    'data': result,
    'total': total
  }
}