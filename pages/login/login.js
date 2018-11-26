const loginApi = require('../../api/login')

const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    unionId: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log('自动登录还未完成，等待回调')
      // 由于getUserInfo是网络请求，可能会在Page.onLoad之后才返回
      // 所以此处加入callback以防止这种情况
      app.userInfoReadyCallback = (userInfo, unionId) => {
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true,
          unionId: unionId
        })
      }
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    //判断点击了授权还是取消
    if (e.detail.errMsg && e.detail.errMsg === 'getUserInfo:fail auth deny'){
      console.log('用户取消了授权...')
      return
    }else {
      loginApi.wxCheckSession()
        .then(() => {
          //获取unionId
          return loginApi.session2UnionId({
            sessionKey: app.globalData.sessionKey,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }, (() => {
            console.log('长时间没有点击登录，sessionKey已过期')
            //尝试调用，这里没法测试
            app.login()
          }))
        }).then(res => {
            console.log('session2UnionId响应为：' + res.data.openId)
            app.globalData.unionId = res.data.openId
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
              userInfo: e.detail.userInfo,
              hasUserInfo: true
          })
        })
    }     
  }
}) 

