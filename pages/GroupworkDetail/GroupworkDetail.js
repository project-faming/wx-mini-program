// pages/GroupworkDetail/GroupworkDetail.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        GroupworkID:'',
        NOButon:'',
        groupondetail:[],
        hasLogin:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      if(options.storeName&&options.storeID){
        wx.setStorageSync('storeName', options.storeName);
        wx.setStorageSync('storeID', options.storeID);
      }
        this.setData({
            GroupworkID:options.id,
            NOButon:options.type
        });
    },
    getGroupworkdata:function(){
        let that = this;
        let apiurl = '';
        if(that.data.NOButon === 'OrderType'){
          apiurl = api.getGrouporderDetil;
        }else{
          apiurl = api.getGroupDetil
        }
        util.request(apiurl, {
            id: that.data.GroupworkID
          }).then(function(res) {
            if (res.errno === 0) {
              that.setData({
                groupondetail: res.data,
              });
            }
          });
    },
    applyStore:function(){
      let that = this;
      if (that.data.hasLogin) {
        wx.showModal({
          title: '提示',
          content: '确认参与该团',
            success: function(res) {
              if (res.confirm) {
                util.request(api.createurl, {
                  teamListId: that.data.GroupworkID
                }).then(function(res) {
                  if (res.errno === 0) {
                    wx.showToast({
                      title: '已参团',
                      icon: 'none',
                      duration: 2000
                    });
                  }else{
                    wx.showToast({
                      title: res.errmsg,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
      } else {
        wx.navigateTo({
          url: "/pages/auth/login/login"
        });
      };
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
      if (app.globalData.hasLogin) {
        this.setData({
          hasLogin: true
        });
      }else{
        wx.navigateTo({
          url: "/pages/auth/login/login"
        });
      }
      this.getGroupworkdata();
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

    },
    // 参团
    groupworkrecord:function(){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      let that = this;
      let storeID = wx.getStorageSync('storeID');
      let storeName = wx.getStorageSync('storeName');
      let shareUserId = 1;
      return {
        title: that.data.groupondetail.goodsName,
        desc: '拼团分享',
        path: '/pages/GroupworkDetail/GroupworkDetail?id=' + this.data.GroupworkID + '&shareUserId=' + shareUserId +'&storeID='+storeID+'&storeName='+storeName
      }
    }
})