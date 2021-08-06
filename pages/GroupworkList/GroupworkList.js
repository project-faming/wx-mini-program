// pages/groupon/grouponList/grouponList.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouponList: [],
    page: 1,
    size: 10,
    count: 0,
  },
  getGrouponList: function() {
    let that = this;
    util.request(api.getBrandList, {
      pageNum: that.data.page,
      pageSize: that.data.size
    },'post').then(function(res) {
      if (res.errno === 0) {
        that.setData({
          grouponList: that.data.grouponList.concat(res.data.list),
          count: res.data.total
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 页面渲染完成
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
     this.getGrouponList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.count > this.data.grouponList.length) {
      this.setData({
        page: this.data.page + 1
      });
      this.getGrouponList();
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
  onShareAppMessage: function() {

  },

})