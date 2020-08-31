// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = null
  if(event.api === 'list') {
    let skip = event.page ? (event.page - 1) * event.pageSize : 0
    let limit = event.pageSize || 10

    let { data } = await db.collection('goods_list')
      .where({
        status: _.in(['init', 'pending'])
      })
      .orderBy('create_time', 'desc')
      .skip(skip)
      .limit(limit)
      .get();
    result = data;
  }

  if (event.api === 'one') {
    data = await db.collection('goods_list')
      .where({
        _id: _.eq(event.id)
      }).get();
    result = data;
  }

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    data: result
  }
}