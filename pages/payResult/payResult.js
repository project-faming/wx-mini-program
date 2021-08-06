var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();
var lastTime = null;
Page({
  data: {
    status: false,
    orderId: 0
  },
  onLoad: function(options) {
    this.setData({
      orderId: options.orderId,
      status: options.status === '1' ? true : false
    });
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  goOrderPage:function(){
    //判断是团购订单还是普通订单，团购订单跳转到我的拼团页
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    util.request(api.IsGroupOrder, {orderId: that.data.orderId}).then(function (res) {
      if (res.errno === 0 && res.data.isGroupon === 1) {
        wx.navigateTo({
          url: '/pages/groupon/myGroupon/myGroupon'
        });
      } else {
        wx.navigateTo({
          url: '/pages/ucenter/order/order'
        });
      }
    });
  },
  payOrder() {
    let that = this;
    // 模拟支付成功，同理，后台也仅仅是返回一个成功的消息而已
    // wx.showModal({
    //   title: '目前不能微信支付',
    //   content: '点击确定模拟支付成功，点击取消模拟未支付成功',
    //   success: function (res) {
    //     if (res.confirm) {
    //       util.request(api.OrderPrepay, { orderId: that.data.orderId }, 'POST').then(res => {
    //         if (res.errno === 0) {
    //           that.setData({
    //             status: true
    //           });
    //         }
    //         else {
    //           util.showErrorToast('支付失败');
    //         }
    //       });
    //     }
    //     else if (res.cancel) {
    //       util.showErrorToast('支付失败');
    //     }

    //   }
    // });

    util.jhxLoadShow("重新付款，请稍后...");
    let nowTime = + new Date();
    if (nowTime - lastTime > 5000 || !lastTime) { //5秒内避免重复提交订单
      lastTime = nowTime;
    } else {
      return false;
    }

    util.request(api.OrderPrepay, {
      orderId: that.data.orderId
    }, 'POST').then(function(res) {
      
      if (res.errno === 0) {
        const payParam = res.data;
        console.log("支付过程开始")
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.packageValue,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function(res) {
            console.log("支付过程成功")
            that.setData({
              status: true
            });
          },
          'fail': function(res) {
            console.log("支付过程失败")
            util.showErrorToast('支付失败');
          },
          'complete': function(res) {
            console.log("支付过程结束")
          }
        });
      }
    });
  }
})