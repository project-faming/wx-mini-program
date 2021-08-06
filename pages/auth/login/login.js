var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    hasLogin: false,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo != null && userInfo != ''){
      this.setData({
        hasLogin: true
      });
    }
    if (this.data.hasLogin) {//如果到了登录界面，前端记录的是用户已经登录，则需要验证后端是否也处于登录
      console.log('check login!!!');
      util.request(api.CheckLogin).then(function(res) {
        if (res.errno === 0) { //后台登录验证成功！
          wx.navigateBack({
            delta: 1
          })
        } else { //后端登录验证失败，重置前端登录信息
          app.globalData.hasLogin = false;
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
        }
      });
    }
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  wxLogin: function() {
    wx.getUserProfile({
      desc:'登录',
      success:res=>{
        if(res.errMsg == "getUserProfile:ok"){
          let userinfo = res.userInfo;
          user.checkLogin().catch(() => {
            user.loginByWeixin(userinfo).then(res => {
              app.globalData.hasLogin = true;
              wx.navigateBack({
                delta: 1
              })
            }).catch((err) => {
              app.globalData.hasLogin = false;
              util.showErrorToast('微信登录失败');
            });
      
          });
        }
      }
    })
  },
  accountLogin: function() {
    wx.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  }
})