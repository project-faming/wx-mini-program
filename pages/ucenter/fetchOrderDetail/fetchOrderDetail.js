var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    flag: false,
    isShared:0,
    brand:{},
    handleOption: {},
    createUserName:null,
    receiveUserName:null,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id,
      isShared: options.isShared ? options.isShared : 0
    });
    this.getOrderDetail();
  },
  getOrderDetail: function() {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function() {
      wx.hideLoading()
    }, 2000);

    let that = this;
    let detailUrl = that.data.isShared == 1 ? api.GiftOrderDetail : api.OrderDetail;
    util.request(detailUrl, {
      orderId: that.data.orderId
    }).then(function(res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          brand:res.data.brand,
          createUserName: res.data.createUserName,
          receiveUserName: res.data.receiveUserName,
          handleOption: res.data.orderInfo.handleOption
        });
      }

      wx.hideLoading();
    });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getOrderDetail();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  showLocation: function (e) {
    var that = this;
    wx.openLocation({
      latitude: that.data.brand.latitude,
      longitude: that.data.brand.longitude,
      name: that.data.brand.name,
      address: that.data.brand.address
    })
  },
  // 页面分享
  onShareAppMessage: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let shareUserId = 1;
    if (userInfo) {
      shareUserId = userInfo.userId;
    }
    let orderId = that.data.orderId;
    
    util.request(api.GiftOrderSend, {
      orderId: orderId
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.errno);
      }
    });
    let scene = "fetchOrder," + orderId +",user," + shareUserId;
    console.log('分享地址：' + '/pages/index/index?scene=' + scene);
    return {
      title: userInfo.nickName +' 送你一个礼物',
      desc: '赠送订单，赶快手下吧！',
      path: '/pages/index/index?scene=' + scene
    }
  },
  giftOrderReceive: function () {
    let that = this;
    let orderId = that.data.orderId;
    util.request(api.GiftOrderReceive, {
      orderId: orderId
    }).then(function (res) {
      if (res.errno === 0) {
        try {
          wx.setStorageSync('tab', 2);//切换到待发货订单
        } catch (e) {

        }
        wx.navigateTo({
          url: '/pages/ucenter/order/order'
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  }
})