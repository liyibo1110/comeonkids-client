/**
 * 封装了http访问的工具函数
 * author: liyibo
 */
const constants = require('../config/constants')
const app = getApp()

function postWithoutPromise(url, paramObj, successCallback, failedCallback){
  //统一增加unionId，不一定有
  paramObj.unionId = app.globalData.userInfo
  wx.request({
    url: url,
    method: 'POST',
    data: paramObj,
    header: { "content-type": "application/x-www-form-urlencoded" },
    success(res) {
      successCallback(res.data)
    },
    fail(res) {
      failedCallback(res.data)
    }
  })
}

function post(url, paramObj, withUnionId){
  //统一增加unionId，不一定有
  if(withUnionId){
    paramObj.unionId = app.globalData.userInfo
  }
  return new Promise(function(resolve, reject){
    wx.request({
      url: url,
      method: 'POST',
      data: paramObj,
      header: {"content-type": "application/x-www-form-urlencoded"},
      success(res) {
        resolve(res.data)
      },
      fail(res) {
        reject(res.data)
      }
    })
  })
  
}

module.exports = {
  post : post
}
