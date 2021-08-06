var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    refundId: 0,
    refundTrace: {},
    orderGoods: [],
    orderInfo:{},
    flag: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      refundId: options.id
    });
    this.getRefundDetail();
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getRefundDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  expandDetail: function() {
    let that = this;
    this.setData({
      flag: !that.data.flag
    })
  },
  getRefundDetail: function() {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function() {
      wx.hideLoading()
    }, 2000);

    let that = this;
    util.request(api.RefundOrderQuery, {
      refundId: that.data.refundId
    }).then(function(res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          refundTrace: res.data.refundTrace,
          orderGoods: res.data.orderGoods,
          orderInfo: res.data.orderInfo
        });
      }
      wx.hideLoading();
    });
  },
  // “取消订单”点击效果
  refundUndo: function() {
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要撤销此退货单吗？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.RefundUndo, {
            refundId: that.data.refundTrace.id
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  bindInputValue(event) {
    let value = event.detail.value;
    //判断是否超过160个字符
    if (value && value.length > 160) {
      return false;
    }
    let tempRefundTrace = this.data.refundTrace;
    tempRefundTrace.freightMsg = event.detail.value;
    this.setData({
      refundTrace: tempRefundTrace
    })
  },
  // 更新备注的物流信息
  addFreightMsg: function() {
    let that = this;
    wx.showModal({
      title: '',
      content: '确定备注物流信息？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.AddFreightMsg, {
            refundId: that.data.refundTrace.id,
            freightMsg: that.data.refundTrace.freightMsg
          }, 'POST').then(function(res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '补充邮寄信息成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})