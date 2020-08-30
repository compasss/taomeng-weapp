//index.js
Page({
  data: {
    page: 1,
    pageSize: 10,
    dataList: []
  },
  onLoad() {
    this.getDataList()
  },
  getDataList() {
    wx.cloud.callFunction({
      name: 'goodsList',
      data: {
        page: this.data.page,
        pageSize: this.data.pageSize
      }
    }).then(res => {
      this.setData({
        dataList: res.result.data
      })
    })
  }
  
})
