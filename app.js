//app.js
//const appApi = require('./api/app')
const loginApi = require('./api/login')
App({
  onLaunch: function () {
    // 展示本地存储能力
   /*  var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs) */

    //尝试自动登录
    this.login()
  },

  login : function() {
    loginApi.wxLogin()
          .then(res => {
              //console.log('code为:' + res.code)
              //后台sessionKey
              return loginApi.code2Session({code: res.code})
          }).then(res => {
            //console.log('响应为：' + res.data.sessionKey)
            this.globalData.sessionKey = res.data.sessionKey
            //成功异步获取sessionKey并存储，才能尝试直接获取用户信息
            //this.tryToGetUserInfo(this)
            return Promise.resolve()
          }).then(() => {
            return loginApi.wxGetSetting()
          }).then(res => {
              if (res.authSetting['scope.userInfo']) {
                console.log('发现已授权，可以直接登录！')
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                return loginApi.wxGetUserInfo(true)
              } else {
                console.log('没有授权！')
                return Promise.reject('notLogin') //不需要catch，直接退出tryToGetUserInfo函数
              }
          }).then(res => {
              this.globalData.userInfo = res.userInfo
              //console.log(res)
              //尝试获取unionId
              //获取unionId
              return loginApi.session2UnionId({
                sessionKey: this.globalData.sessionKey,
                encryptedData: res.encryptedData,
                iv: res.iv
              })
          }, null).then(res => {
              console.log('自动登录session2UnionId响应为：' + res.data.openId)
              this.globalData.unionId = res.data.openId
              //由于getUserInfo是网络请求，可能会在Page.onLoad之后才返回
              //所以此处加入callback以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(this.globalData.userInfo, this.globalData.unionId)
              }
          }).catch(res => {
            console.log('错误为：' + res.data) 
          })
  },

  globalData: {
    userInfo: null,
    sessionKey: null,
    unionId: null
  }
})