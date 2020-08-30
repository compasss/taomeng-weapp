// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let skip = event.page ? (event.page - 1) * event.pageSize : 0
  let limit = event.pageSize || 10

  const { data } = await db.collection('goods_list')
    .where({
      status: _.in(['init', 'pending'])
    })
    .orderBy('create_time', 'desc')
    .skip(skip)
    .limit(limit)
    .get()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    data: data
  }
}