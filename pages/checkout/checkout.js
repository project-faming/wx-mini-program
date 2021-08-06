var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var check = require('../../utils/check.js');

var app = getApp();
var lastTime = null;

Page({
    data: {
        isMultiOrderModel: 0,
        brandCartgoods:[],
        checkedGoodsList: [],
        checkedAddress: {},
        availableCouponLength: 0, // 可用的优惠券数量
        goodsTotalPrice: 0.00, //商品总价
        freightPrice: 0.00, //快递费
        couponPrice: 0.00, //优惠券的价格
        grouponPrice: 0.00, //团购优惠价格
        orderTotalPrice: 0.00, //订单总价
        actualPrice: 0.00, //实际需要支付的总价
        cartId: 0,
        addressId: 0,
        couponId: 0,
        message: '',
        grouponLinkId: 0, //参与的团购，如果是发起则为0
        grouponRulesId: 0, //团购规则ID
        defaultFreight:true,//配送方式，默认快递方式
        consignee: '',//自提 联系人
        consigneeMobile: '',//自提 联系人手机号
        fetchAddress: '',//自提取货地址
        longitude: 0,//店铺经度
        brandName: '',//店铺名称
        latitude: 0 //店铺维度
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
    },

    //获取checkou信息
    getCheckoutInfo: function() {
        let that = this;
        util.request(api.CartCheckout, {
            cartId: that.data.cartId,
            addressId: that.data.addressId,
            couponId: that.data.couponId,
            grouponRulesId: that.data.grouponRulesId
        }).then(function(res) {
            if (res.errno === 0) {
                let brandCartgoods = [];
                let checkedGoodsList = [];
                if (res.data.isMultiOrderModel === 1) {
                    brandCartgoods = res.data.brandCartgoods;
                } else {
                    checkedGoodsList = res.data.checkedGoodsList;
                }
                that.setData({
                    isMultiOrderModel: res.data.isMultiOrderModel,
                    brandCartgoods: brandCartgoods,
                    checkedGoodsList: checkedGoodsList,
                    checkedAddress: res.data.checkedAddress,
                    availableCouponLength: res.data.availableCouponLength,
                    actualPrice: res.data.actualPrice,
                    couponPrice: res.data.couponPrice,
                    grouponPrice: res.data.grouponPrice,
                    freightPrice: res.data.freightPrice,
                    goodsTotalPrice: res.data.goodsTotalPrice,
                    orderTotalPrice: res.data.orderTotalPrice,
                    addressId: res.data.addressId,
                    couponId: res.data.couponId,
                    grouponRulesId: res.data.grouponRulesId,
                });
            }
            wx.hideLoading();
        });
    },
    selectAddress() {
        wx.navigateTo({
            url: '/pages/ucenter/address/address',
        })
    },
    selectCoupon() {
        wx.navigateTo({
            url: '/pages/ucenter/couponSelect/couponSelect',
        })
    },
    bindMessageInput: function(e) {
        this.setData({
            message: e.detail.value
        });
    },
    onReady: function() {
        // 页面渲染完成

    },
    onShow: function() {
        // 页面显示
        wx.showLoading({
            title: '加载中...',
        });
        try {
            var cartId = wx.getStorageSync('cartId');
            if (cartId) {
                this.setData({
                    'cartId': cartId
                });
            }

            var addressId = wx.getStorageSync('addressId');
            if (addressId) {
                this.setData({
                    'addressId': addressId
                });
            }

            var couponId = wx.getStorageSync('couponId');
            if (couponId) {
                this.setData({
                    'couponId': couponId
                });
            }

            var grouponRulesId = wx.getStorageSync('grouponRulesId');
            if (grouponRulesId) {
                this.setData({
                    'grouponRulesId': grouponRulesId
                });
            }

            var grouponLinkId = wx.getStorageSync('grouponLinkId');
            if (grouponLinkId) {
                this.setData({
                    'grouponLinkId': grouponLinkId
                });
            }
        } catch (e) {
            // Do something when catch error
            console.log(e);
        }

        this.getCheckoutInfo();
    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭

    },
    checkedFreight:function(){
        if (this.data.defaultFreight) { // 表示选择了自提
            //后台验证 1.如果选择配送是自提，则需判断当前下单是否有多个店铺，多个店铺不允许下自提订单，如果一个店铺则继续验证店铺是否录入了自提地址
            util.request(api.FetchVaild, {
                cartId: this.data.cartId
            }, 'POST').then(res => {
                if (res.errno === 0) {
                    this.setData({
                        fetchAddress: res.data.fetchAddress,
                        longitude: res.data.longitude,
                        latitude: res.data.latitude,
                        brandName: res.data.brandName,
                        defaultFreight: !this.data.defaultFreight,
                        actualPrice: this.data.defaultFreight ? (new Number(this.data.actualPrice) - new Number(this.data.freightPrice)).toFixed(2) : (new Number(this.data.actualPrice) + new Number(this.data.freightPrice)).toFixed(2)
                    });
                } else {
                    util.showErrorToast(res.errmsg);
                }
            });
        } else {
            this.setData({
                fetchAddress: '',
                longitude: 0,
                latitude: 0,
                brandName: '',
                defaultFreight: !this.data.defaultFreight,
                actualPrice: this.data.defaultFreight ? (new Number(this.data.actualPrice) - new Number(this.data.freightPrice)).toFixed(2) : (new Number(this.data.actualPrice) + new Number(this.data.freightPrice)).toFixed(2)
            });
        }
    },
    showLocation: function (e) {
        var that = this;
        wx.openLocation({
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            name: that.data.brandName,
            address: that.data.fetchAddress
        })
    },
    bindinputMobile(e) {
        this.setData({
            consigneeMobile: e.detail.value
        });
    },
    bindinputName(e) {
        this.setData({
            consignee: e.detail.value
        });
    },
    submitOrder: function() {
        //如果是默认快递方式，则要验证收货地址
        if (this.data.defaultFreight && this.data.addressId <= 0) {
            util.showErrorToast('请选择收货地址');
            return false;
        }
        //自提方式需验证联系人及手机号码
        if (!this.data.defaultFreight && this.data.consignee == '') {
            util.showErrorToast('请输入联系人姓名');
            return false;
        }
        if (!this.data.defaultFreight && !check.isValidPhone(this.data.consigneeMobile)) {
            util.showErrorToast('手机号不正确');
            return false;
        }

        util.jhxLoadShow("正在下单，请稍后...");
        let nowTime = + new Date();
        if (nowTime - lastTime > 5000 || !lastTime) { //5秒内避免重复提交订单
            lastTime = nowTime;
        } else {
            return false;
        }

        let shareUserId = wx.getStorageSync('shareUserId');
        if (!shareUserId || shareUserId =='undefined'){//如果无真实的代理用户,则指定为默认第一个系统用户
            shareUserId = 1;
        }
        let storeID = wx.getStorageSync('storeID');
        util.request(api.OrderSubmit, {
            brandId:storeID,
            cartId: this.data.cartId,
            addressId: this.data.addressId,
            couponId: this.data.couponId,
            message: this.data.message,
            grouponRulesId: this.data.grouponRulesId,
            grouponLinkId: this.data.grouponLinkId,
            defaultFreight: this.data.defaultFreight,
            consignee: this.data.consignee,
            consigneeMobile: this.data.consigneeMobile,
            shareUserId: shareUserId
        }, 'POST').then(res => {
            util.jhxLoadHide();
            if (res.errno === 0) {

                // 下单成功，重置couponId
                try {
                    wx.setStorageSync('couponId', 0);
                } catch (error) {

                }

                const orderId = res.data.orderId;
                util.request(api.OrderPrepay, {
                    orderId: orderId
                }, 'POST').then(function(res) {
                    if (res.errno === 0) {
                        const payParam = res.data;
                        console.log("支付过程开始");
                        wx.requestPayment({
                            'timeStamp': payParam.timeStamp,
                            'nonceStr': payParam.nonceStr,
                            'package': payParam.packageValue,
                            'signType': payParam.signType,
                            'paySign': payParam.paySign,
                            'success': function(res) {
                                console.log("支付过程成功");
                                wx.redirectTo({
                                    url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                                });
                            },
                            'fail': function(res) {
                                console.log("支付过程失败");
                                wx.redirectTo({
                                    url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                                });
                            },
                            'complete': function(res) {
                                console.log("支付过程结束")
                            }
                        });
                    } else {
                        wx.redirectTo({
                            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                        });
                    }
                });

            } else {
                wx.redirectTo({
                    url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                });
            }
        });
    }
});