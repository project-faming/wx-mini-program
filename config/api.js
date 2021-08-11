// 测试
// var WxApiRoot = 'http://arge.linde.xin/c/wx/';
// var argeapi = 'http://arge.linde.xin/c/';
// 线上
var WxApiRoot = 'https://linde.xin/c/wx/';
var argeapi = 'https://linde.xin/c/';
module.exports = {
  brandList:argeapi +'wx/home/brandList',//门店列表
  getBrandList:argeapi +'api/v1/teamList/getBrandList',//门店拼团列表
  getGroupDetil:argeapi +'api/v1/teamList/details',//拼团详情
  getGrouporderDetil:argeapi +'api/v1/teamorder/details',//拼团订单详情
  GroupOrderList:argeapi +'api/v1/teamList/getMyList',//我的拼团
  GroupOrderListP:argeapi +'api/v1/teamorder/getList',//我参与的拼团
  createurl:argeapi+'api/v1/teamorder/create',//参加拼团
  wantTeamLeader:argeapi+'/wx/user/wantTeamLeader',//申请团长
  judgeType:argeapi+'wx/user/index',//是否是团长




  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  CheckLogin: WxApiRoot + 'auth/checkLogin', //验证用户在后台是否处于登录状态

  GoodsCount: WxApiRoot + 'goods/count', //统计商品总数
  GoodsList: WxApiRoot + 'goods/list', //获得商品列表
  GoodsCategory: WxApiRoot + 'goods/category', //获得分类数据
  GoodsDetail: WxApiRoot + 'goods/detail', //获得商品的详情
  GoodsRelated: WxApiRoot + 'goods/related', //商品详情页的关联商品（大家都在看）

  CreateShareImg: WxApiRoot + 'agency/createShareImg', //创建分享海报

  BrandList: WxApiRoot + 'brand/list', //品牌列表
  BrandDetail: WxApiRoot + 'brand/detail', //品牌详情

  CartList: WxApiRoot + 'cart/index', //获取购物车的数据
  CartAdd: WxApiRoot + 'cart/add', // 添加商品到购物车
  CartFastAdd: WxApiRoot + 'cart/fastadd', // 立即购买商品
  CartUpdate: WxApiRoot + 'cart/update', // 更新购物车的商品
  CartDelete: WxApiRoot + 'cart/delete', // 删除购物车的商品
  CartChecked: WxApiRoot + 'cart/checked', // 选择或取消选择商品
  CartGoodsCount: WxApiRoot + 'cart/goodscount', // 获取购物车商品件数
  CartCheckout: WxApiRoot + 'cart/checkout', // 下单前信息确认

  CollectList: WxApiRoot + 'collect/list', //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete', //添加或取消收藏

  CommentList: WxApiRoot + 'comment/list', //评论列表
  CommentCount: WxApiRoot + 'comment/count', //评论总数
  CommentPost: WxApiRoot + 'comment/post', //发表评论

  TopicList: WxApiRoot + 'topic/list', //专题列表
  TopicDetail: WxApiRoot + 'topic/detail', //专题详情
  TopicRelated: WxApiRoot + 'topic/related', //相关专题

  SearchIndex: WxApiRoot + 'search/index', //搜索关键字
  SearchResult: WxApiRoot + 'search/result', //搜索结果
  SearchHelper: WxApiRoot + 'search/helper', //搜索帮助
  SearchClearHistory: WxApiRoot + 'search/clearhistory', //搜索历史清楚

  AddressList: WxApiRoot + 'address/list', //收货地址列表
  AddressDetail: WxApiRoot + 'address/detail', //收货地址详情
  AddressSave: WxApiRoot + 'address/save', //保存收货地址
  AddressDelete: WxApiRoot + 'address/delete', //保存收货地址

  ExpressQuery: WxApiRoot + 'express/query', //物流查询

  RegionList: WxApiRoot + 'region/list', //获取区域列表

  OrderSubmit: WxApiRoot + 'order/submit', // 提交订单
  OrderPrepay: WxApiRoot + 'order/prepay', // 订单的预支付会话
  OrderList: WxApiRoot + 'order/list', //订单列表
  OrderDetail: WxApiRoot + 'order/detail', //订单详情
  GiftOrderDetail: WxApiRoot + 'order/giftOrderDetail', //赠送自提订单的详情
  GiftOrderSend: WxApiRoot + 'order/giftOrderSend', //自提订单赠送发起
  GiftOrderReceive: WxApiRoot + 'order/giftOrderReceive', //自提订单赠送收取
  GiftOrderList: WxApiRoot + 'order/giftOrderlist', //自提赠送订单列表
  ExpressTrace: WxApiRoot + 'order/expressTrace', //订单物流
  OrderCancel: WxApiRoot + 'order/cancel', //取消订单
  OrderRefund: WxApiRoot + 'order/refund', //退款取消订单
  OrderDelete: WxApiRoot + 'order/delete', //删除订单
  OrderConfirm: WxApiRoot + 'order/confirm', //确认收货
  OrderGoods: WxApiRoot + 'order/goods', // 代评价商品信息
  OrderComment: WxApiRoot + 'order/comment', // 评价订单商品信息
  PreOrderRefund: WxApiRoot + 'order/preOrderRefund',//申请退货可退商品查询
  RefundApply: WxApiRoot + 'order/refundApply',//退货申请
  RefundOrderQuery: WxApiRoot + 'order/refundOrderQuery',//退货单明细
  RefundUndo: WxApiRoot + 'order/refundUndo',//退货撤销
  AddFreightMsg: WxApiRoot + 'order/addFreightMsg',//退货但快递信息补充
  FetchVaild: WxApiRoot + 'order/fetchVaild',//退货但快递信息补充
  
  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹

  UserFormIdCreate: WxApiRoot + 'formid/create', //用户FromId，用于发送模版消息

  GroupOnList: WxApiRoot + 'groupon/list', //团购列表
  GroupOn: WxApiRoot + 'groupon/query', //团购API-查询
  GroupOnMy: WxApiRoot + 'groupon/my', //团购API-我的团购
  GroupOnDetail: WxApiRoot + 'groupon/detail', //团购API-详情
  GroupOnJoin: WxApiRoot + 'groupon/join', //团购API-详情
  IsGroupOrder: WxApiRoot + 'groupon/isGrouponOrder', //团购API-是否团购订单

  CouponList: WxApiRoot + 'coupon/list', //优惠券列表
  CouponMyList: WxApiRoot + 'coupon/mylist', //我的优惠券列表
  CouponSelectList: WxApiRoot + 'coupon/selectlist', //当前订单可用优惠券列表
  CouponReceive: WxApiRoot + 'coupon/receive', //优惠券领取
  CouponReceiveAll: WxApiRoot + 'coupon/receiveAll', //优惠券领取
  CouponExchange: WxApiRoot + 'coupon/exchange', //优惠券兑换
  GetUserCoupon: WxApiRoot + 'coupon/getUserCoupon',//用户个人可领取优惠券查询

  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,

  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  BrokerageMain: WxApiRoot + 'brokerage/main',//佣金收益主页面
  SettleOrderList: WxApiRoot + 'brokerage/settleOrderList',//佣金收益主页面
  ApplyWithdrawal: WxApiRoot + 'brokerage/applyWithdrawal',//佣金提现申请
  ExtractList: WxApiRoot + 'brokerage/extractList',//佣金账号提现记录
  ArticleDetail: WxApiRoot + 'article/detail',//公告详情
  ApplyAgency: WxApiRoot + 'user/applyAgency',//代理申请
  GetSharedUrl: WxApiRoot + 'user/getSharedUrl' //获取推广二维码
};