// pages/choicestore/choicestore.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        choicestoreData:[],
        latitude: "",
        longitude: "",
        onchoicesname:'',
        page: 1,
        size: 10,
        count: 0,
    },
    // 选择门店
    storeclick: function(event){
        let data = event.currentTarget.dataset.item
        wx.setStorageSync('storeName', data.name);
        wx.setStorageSync('storeID', data.id);
        wx.setStorageSync('storeAdds', data.address);
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let name = wx.getStorageSync("storeName");
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            console.log(res);
            const latitude = res.latitude;//纬度
            const longitude = res.longitude;//经度
            that.setData({
              latitude:latitude,
              longitude:longitude,
              onchoicesname:name
            });
            that.getIndexData();
          }
         });
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
    getIndexData:function(){
        let that = this;
        util.request(api.brandList,{
            longitude:that.data.longitude,
            latitude:that.data.latitude,
            page: that.data.page,
            size: that.data.size,
          }).then(function(res) {
            if (res.errno === 0) {
              that.setData({
                choicestoreData:that.data.choicestoreData.concat(res.data.brandList),
                count:res.data.total
              });
            }
          });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if (this.data.count > this.data.choicestoreData.length) {
        this.setData({
          page: this.data.page + 1
        });
        this.getIndexData();
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