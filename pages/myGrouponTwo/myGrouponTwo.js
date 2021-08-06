// pages/myGrouponTwo/myGrouponTwo.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showType: 0,
        orderList:[],
        page: 1,
        size: 10,
        total: 1,
    },
    // 列表跳转
    groupworkDe:function(event){
      let that = this;
      let id= event.currentTarget.dataset.id
      if(that.data.showType == 0){
        wx.navigateTo({
          url: "/pages/GroupworkDetail/GroupworkDetail?id="+id
        });
      }
      if(that.data.showType == 1){
        wx.navigateTo({
          url: "/pages/GroupworkDetail/GroupworkDetail?id="+id+'&type=OrderType'
        });
      }
     
    },
    // 点击顶部分类
    switchTab: function(event) {
        let showType = event.currentTarget.dataset.index;
        this.setData({
          orderList: [],
          showType: showType,
          page: 1,
          size: 10,
          total: '',
        });
        this.getOrderList();
    },
    // 获取数据
    getOrderList() {
      let that = this;
        let apiurl = '';
        if(that.data.showType == 0){
            apiurl = api.GroupOrderList;
        }
        if(that.data.showType == 1){
            apiurl = api.GroupOrderListP;
        }
        util.request(apiurl, {
          type: that.data.showType,
          pageNum: that.data.page,
          pageSize: that.data.size
        },'POST').then(function(res) {
          if (res.errno === 0) {
            that.setData({
              orderList: that.data.orderList.concat(res.data.list),
              total: res.data.total
            });
          }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getOrderList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
     
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      if (!app.globalData.hasLogin) {
        wx.navigateTo({
          url: "/pages/auth/login/login"
        });
      }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.total > this.data.orderList.length) {
            this.setData({
              page: this.data.page + 1
            });
            this.getOrderList();
          } else {
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 2000
            });
            return false;
          }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})