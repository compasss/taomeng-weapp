// miniprogram/pages/goodsDetail/goodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = wx.getStorageSync('goodsDetail')
    this.setData({
      id: options.id,
      data: data
    })
  },

  copyLink(str, callback) {
    // 复制活动链接
    wx.setClipboardData({
      data: str,
      success (res) {
        callback && callback()
      }
    })
  },
  newOrder() {
    // 京东直接跳小程序，淘宝要复制口令
    if (this.data.data.platform === '淘宝') {
      wx.showModal({
        title: '提示',
        content: '复制口令以后，打开淘宝APP下单',
        confirmText: '复制口令',
        success (res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: 'data',
              success (res) {
                wx.showToast({
                  title: '复制成功',
                  duration: 2000,
                  icon: 'none'
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.jumpMiniProgram(this.data.data.promo_url)
    }
  },
  jumpMiniProgram(url) {
    // 跳转京东小程序
    let path= "/pages/union/proxy/proxy?spreadUrl=" + encodeURIComponent('url')
    wx.navigateToMiniProgram({
        appId: 'wx91d27dbf599dff74',
        path: path,
        success(res) {
          console.log('success', res)
        },
        fail(res) {
          // uni.$toast('跳转失败') //uni-app 框架的方法，不用此框架可用其它提示
          console.log('fail', res)
        },
        complete() {
          //uni.hideLoading()
        }
		})
  }
})