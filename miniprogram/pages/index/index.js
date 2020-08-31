//index.js
Page({
  data: {
    page: 1,
    pageSize: 10,
    dataList: [],
    lock: false
  },
  onLoad() {
    this.getDataList().then(res => {
      this.setData({
        dataList: res.result.data
      })
    }).catch(e => {
      console.error(e)
    })
  },
  getDataList() {
    return wx.cloud.callFunction({
      name: 'goods',
      data: {
        api: 'list',
        page: this.data.page,
        pageSize: this.data.pageSize
      }
    })
  },
  nextPage() {
    if(this.data.lock) {
      return 
    }
    this.setData({
      lock: true,
      page: this.data.page + 1
    })
    this.getDataList().then(res => {
      this.setData({
        dataList: res.result.data,
        lock: false
      })
    }).catch(e => {
      this.setData({
        page: this.data.page - 1
      })
      console.error(e)
    })
  },
  showDetail(event) {
    let data = this.data.dataList[event.currentTarget.dataset.index];
    wx.setStorageSync('goodsDetail', data)
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?id=${event.currentTarget.dataset.id}`
    })
    console.log(event)
  }
})
