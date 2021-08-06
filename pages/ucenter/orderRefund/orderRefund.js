var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    refundGoodsAmt:0.0,
    refundReason: '',
    flag: false,
    handleOption: {},
    checkedAllStatus:true,
    isGrouponOrder: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getRefundGoodsAmt: function () {
    let that = this;
    let refundGoodsAmt = 0.00;
    that.data.orderGoods.forEach(function (v) {
      if (v.checked === true) {
        refundGoodsAmt = refundGoodsAmt + v.price * v.number;
      }
    });
    if (that.data.isGrouponOrder){//如果是团购
      refundGoodsAmt = refundGoodsAmt - that.data.orderInfo.discountPrice;
    }
    let checkedAllStatus = this.isCheckedAll();
    if ((that.data.orderInfo.orderStatus == 201 || that.data.orderInfo.orderStatus == 204 
         || that.data.orderInfo.orderStatus == 205) && checkedAllStatus){ //订单未发货，且是全选，则还需退运费
      refundGoodsAmt = refundGoodsAmt + that.data.orderInfo.freightPrice;
    }
    refundGoodsAmt = new Number(refundGoodsAmt).toFixed(2);
    console.log(refundGoodsAmt);
    return refundGoodsAmt;
  },
  checkedAll: function () {
    if(this.data.isGrouponOrder){//团购订单禁止退款部分商品
      util.showErrorToast('该订单属于团购，不支持选择退部分商品!');
      return false;
    }
    //编辑状态,将所有
    let that = this;
    let checkedAllStatus = this.isCheckedAll();
    let tmpOrderGoods = this.data.orderGoods.map(function (element, index, array) {
      element.checked = !checkedAllStatus;
      return element;
    });
    that.setData({
      orderGoods: tmpOrderGoods,
      checkedAllStatus: that.isCheckedAll(),
      refundGoodsAmt: that.getRefundGoodsAmt()
    });
  },
  isCheckedAll: function () {
    let that = this;
      //判断退款商品是否已全选
    return that.data.orderGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  expandDetail: function () {
    let that = this;
    this.setData({
      flag: !that.data.flag
    })
  },
  getOrderDetail: function () {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading()
    }, 2000);

    let that = this;
    util.request(api.PreOrderRefund, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        //默认选中所有商品都选中
        let tmpOrderGoods = res.data.orderGoods.map(function (element, index, array) {
          element.checked = true;
          return element;
        });
        
        that.setData({
          orderInfo: res.data.orderInfo,
          isGrouponOrder: res.data.isGrouponOrder,
          orderGoods: tmpOrderGoods,
          checkedAllStatus: that.isCheckedAll(),
          handleOption: res.data.orderInfo.handleOption
        });
        //设置商品信息后再获取退款金额
        let refundGoodsAmt = that.getRefundGoodsAmt();
        that.setData({
          refundGoodsAmt: refundGoodsAmt
        });
      }
      wx.hideLoading();
    });
  },
  checkedItem: function (event){
    if(this.data.isGrouponOrder){//团购订单禁止退款部分商品
      util.showErrorToast('该订单属于团购，不支持选择退部分商品!');
      return false;
    }
    let productId = event.currentTarget.dataset.productid;
    let that = this;
    let tmpGoodsData = this.data.orderGoods.map(function (element, index, array) {
      if (element.productId === productId) {
        element.checked = !element.checked;
      }
      return element;
    });
    that.setData({
      orderGoods: tmpGoodsData,
      checkedAllStatus: that.isCheckedAll(),
      refundGoodsAmt: that.getRefundGoodsAmt()
    });
  },
  // “取消订单并退款”点击效果
  refundOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderRefund, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
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
    this.setData({
      refundReason: event.detail.value,
    })
  },
  refundApply:function(){
    //获取已选择的商品
    let that = this;
    let productIds = [];
    that.data.orderGoods.forEach(function (o) {
      if (o.checked == true) {
        productIds.push(o.productId);
      }
    });
    if (productIds.length <= 0) {
      util.showErrorToast('请勾选需要退货的商品');
      return false;
    }
    if (!that.data.refundReason) {
      util.showErrorToast('请填写退货原因')
      return false;
    }
    util.request(api.RefundApply, {
      orderId: that.data.orderId,
      productIds: productIds,
      refundGoodsAmt: that.data.refundGoodsAmt, 
      refundReason: that.data.refundReason
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let refundId = res.data.refundId;
        wx.redirectTo({ url: '/pages/ucenter/refundDetail/refundDetail?id=' + refundId });
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})