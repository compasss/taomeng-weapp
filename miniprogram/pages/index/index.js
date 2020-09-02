//index.js
Page({
  data: {
    page: 1,
    pageSize: 10,
    total: 0,
    dataList: [],
    query: '',
    lock: false
  },
  onLoad() {
    this.getDataList().then(res => {}).catch(e => {
      console.error(e)
    })
  },
  getDataList(more) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'goods',
        data: {
          api: 'list',
          query: this.data.query,
          page: this.data.page,
          pageSize: this.data.pageSize
        }
      }).then(res => {
        if (more) {
          this.setData({
            dataList: [...this.data.dataList, res.result.data],
            total: res.result.total
          })
        } else {
          this.setData({
            dataList: res.result.data,
            total: res.result.total
          })
        }
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  handleInput(ev) {
    // 输入
    this.setData({
      query: ev.detail.value
    })
  },
  handleSearch() {
    // 搜索框
    this.setData({
      page: 1
    })
    this.getDataList().then(res => {}).catch(e => {
      console.error(e)
    })
  },
  nextPage() {
    if(this.data.page * this.data.pageSize >= this.data.total || this.data.lock) {
      return 
    }
    this.setData({
      lock: true,
      page: this.data.page + 1
    })
    this.getDataList(true).then(res => {
      this.setData({
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
