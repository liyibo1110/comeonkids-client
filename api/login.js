const constants = require('../config/constants')
const http = require('../utils/http')

const session2UnionIdUrl = constants.HTTP_SERVER + '/api/wechat/mini/session2UnionId'
const code2SessionUrl = constants.HTTP_SERVER + '/api/wechat/mini/code2Session'

function wxLogin(){
  return new Promise(function(resolve, reject){
    wx.login({
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    }) 
  })
}

function wxCheckSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}

function wxGetSetting() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}

function wxGetUserInfo(withCredentials) {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials, withCredentials,
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}

function code2Session(paramObj) {
  console.log('准备发起code2Session后端调用')
  return http.post(code2SessionUrl, paramObj, false)
}

function session2UnionId(paramObj) {
  console.log('准备发起session2UnionId后端调用')
  return http.post(session2UnionIdUrl, paramObj, false)
}

module.exports = {
  wxLogin: wxLogin,
  wxCheckSession: wxCheckSession,
  wxGetSetting: wxGetSetting,
  wxGetUserInfo: wxGetUserInfo,
  code2Session: code2Session,
  session2UnionId: session2UnionId
}