const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    GroupworkData:[],
    storeName:'',
    storeAdds:'',
    storeID:'',
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    groupons: [],
    floorGoods: [],
    banner: [],
    channel: [],
    coupon: [],
    articles:[],
    goodsCount: 0,
    indicatorDots: false,
    window: false,
    colseCoupon:false,
    isAgent: false,
  },

  onShareAppMessage: function() {
    let storeID = wx.getStorageSync('storeID');
    let storeName = wx.getStorageSync('storeName');
    let userInfo = wx.getStorageSync('userInfo');
    let shareUserId = 1;
    if (userInfo){
      shareUserId = userInfo.userId;
    }
    return {
      title: '来健生鲜',
      desc: '来健生鲜与您共约',
      path: '/pages/index/index?shareUserId=' + shareUserId +'&storeID='+storeID+'&storeName='+storeName
    }
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIndexData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  getIndexData: function() {
    let that = this;
  
    util.request(api.IndexUrl).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          GroupworkData:res.data.brandGoodsList,
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.likeGoodsList,
          topics: res.data.topicList,
          brands: res.data.brandList,
          floorGoods: res.data.floorGoodsList,
          banner: res.data.banner,
          articles: res.data.articles,
          groupons: res.data.grouponList,
          channel: res.data.channel,
          coupon: res.data.couponList
        });
      }
    });
    // util.request(api.GoodsCount).then(function (res) {
    //   that.setData({
    //     goodsCount: res.data.goodsCount
    //   });
    // });
  },
  onLoad: function(options) {
    let that = this;
    if(options.storeName && options.storeID){
      wx.setStorageSync('storeName', options.storeName);
      wx.setStorageSync('storeID', options.storeID);
      wx.setStorageSync('storeAdds', options.storeAdds);
    }
    this.setData({
      colseCoupon: false
    });
    //如果有分享用户，则设置
    if (options.shareUserId){
      wx.setStorageSync('shareUserId', options.shareUserId);
    }
    // 页面初始化 options为页面跳转所带来的参数
    if (options.scene) {
      //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      var scene = decodeURIComponent(options.scene);
      console.log("scene:" + scene);

      let info_arr = [];
      info_arr = scene.split(',');
      let _type = info_arr[0];
      let id = info_arr[1];

      let shareUserId = null;//默认用户
      if (info_arr.length == 4 && info_arr[2] == 'user'){
    	  shareUserId = info_arr[3];
      } else if (_type == 'user'){
    	  shareUserId = id;
      }

	  if (shareUserId != null){
	  	 wx.setStorageSync('shareUserId', id);
	  }
  	
      if (_type == 'goods') {
        wx.navigateTo({
          url: '../goods/goods?id=' + id
        });
      } else if (_type == 'groupon') {
        wx.navigateTo({
          url: '../goods/goods?grouponId=' + id
        });
      } else if (_type == 'brand') {
          wx.navigateTo({
              url: '../brandDetail/brandDetail?id=' + id
            });
      } else if (_type == 'topic') {
           wx.navigateTo({
               url: '../topicDetail/topicDetail?id=' + id
             });
      } else if (_type == 'fetchOrder') {
           wx.navigateTo({
             url: '../ucenter/fetchOrderDetail/fetchOrderDetail?id=' + id + '&isShared=1'
             });
      } else {
        wx.navigateTo({
          url: '../index/index'
        });
      }
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (options.grouponId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '../goods/goods?grouponId=' + options.grouponId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (options.goodId) {
      //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '../goods/goods?id=' + options.goodId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (options.orderId) {
      //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      wx.navigateTo({
        url: '../ucenter/orderDetail/orderDetail?id=' + options.orderId
      });
    }
  },
  onReady: function() {
    // 页面渲染完成
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (!that.data.colseCoupon && userInfo && that.data.coupon.length > 0) {
      that.setData({ window: true });
    }
    if (userInfo && userInfo.userLevel==2) {
      that.setData({ isAgent: true });
    }
  },
  onShow: function() {
    let that = this;
    let storeName = wx.getStorageSync('storeName');
    let storeID = wx.getStorageSync('storeID');
    let storeAdds = wx.getStorageSync('storeAdds');
    if(storeName && storeID){
      that.setData({
        storeName:storeName,
        storeID:storeID,
          storeAdds:storeAdds,
      });
    }else{
      wx.navigateTo({
        url: "/pages/choicestore/choicestore"
      });
    }
    // 每次页面显示，需获取是否用户登录，如果用户登录，则查询用户是否有优惠券，有则弹出优惠券领取窗口
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      util.request(api.GetUserCoupon, null, 'GET').then(res => {
        if (res.errno === 0) {
		    that.setData({
		          coupon: res.data.couponList
		   });
		   
		   if (!that.data.colseCoupon && userInfo && that.data.coupon.length > 0) {
		      that.setData({ window: true });
		   } else {
		      that.setData({window:false});
		   }
        }
      })
    }
    if (userInfo && userInfo.userLevel == 2) {
      that.setData({ isAgent: true });
    }
    this.getIndexData();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  onColse: function () {
    this.setData({
       window: false,
       colseCoupon:true
     });
  },
  getCoupon(e) {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index
    util.request(api.CouponReceive, {
      couponId: couponId
    }, 'POST').then(res => {
      if (res.errno === 0) {
        wx.showToast({
          title: "领取成功"
        })
      }
      else{
        util.showErrorToast(res.errmsg);
      }
    })
  },
})