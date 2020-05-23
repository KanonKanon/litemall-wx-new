// 以下是业务服务器API地址
// 本机开发时使用
// var WxApiRoot = 'https://localhost/wx/';
// 局域网测试使用
// var WxApiRoot = 'https://192.168.4.5/wx/';
// 云平台部署时使用
// var WxApiRoot = 'http://123.57.38.203:8888/wx/';
// var WxApiRoot = 'https://test.bingold.cn/wx/';
// 云平台上线时使用
var WxApiRoot = 'https://litemall.bingold.cn/wx/';

// https://litemall.bingold.cn/wx/catalog/list

module.exports = {
  WxApiRoot: WxApiRoot,
  
  StoreAllList: WxApiRoot +'store/allList',//带区域的店铺列表

  //直播相关接口
  LiveGetInfo:WxApiRoot+'live/getInfo', //直播室列表

  //预售功能接口
  CartIsAdvanceSale: WxApiRoot +'cart/isAdvanceSale', //判断是否预售商品 get {goodsId}

  //打通进销存接口
  CloudCardOpen: WxApiRoot +'offlineUc/cloudCardOpen',//随享卡开卡
  OfflineUcOrc: WxApiRoot +'offlineUc/orc',//身份证OCR
  OffGoodsDetail: WxApiRoot +'offGoods/detail',//商品详情 get {goodsId}
  OffCartIndex: WxApiRoot +'offCart/index',//用户购物车信息 get 无参
  OffCartAdd: WxApiRoot +'offCart/add',//加入商品到购物车 post {goodsId,serialnumber}
  OffCartFastadd: WxApiRoot +'offCart/fastadd',//立即购买 post {goodsId,serialnumber}
  OffCartUpdate: WxApiRoot +'offCart/update',//修改购物车商品规格 post {id,goodsId,serialnumber}
  OffCartChecked: WxApiRoot +'offCart/checked',//购物车商品货品勾选状态 post {serialnumberList,isChecked}
  OffCartDelete: WxApiRoot +'offCart/delete',//购物车商品删除 post {serialnumberList}
  OffCartCheckout: WxApiRoot +'offCart/checkout',//购物车下单 get {cartId,offlineAddressId,couponId,grouponRulesId}
  OffCartGoodscount: WxApiRoot +'offCart/goodscount',//购物车商品数量 get 无参
  OffOrderSubmit: WxApiRoot +'offOrder/submit',//提交订单 post {cartId,offlineAddressId,couponId,message,grouponRulesId,grouponLinkId,deliveryTime}

  OffMmaSkDetail: WxApiRoot +'offMmaSk/detail',//秒杀详情 get {skId}
  OffMmaSkSubmit: WxApiRoot + 'offMmaSk/submit',//秒杀下单 post{skId,serialnumber,offlineAddressId,message,deliveryTime}



  OfflineUcSaleList:WxApiRoot+'offlineUc/saleList',//销售单列表
  OfflineUcSaleGet:WxApiRoot+'offlineUc/saleGet',//销售单详情
  OfflineUcFixedDepositList:WxApiRoot+'offlineUc/fixedDepositList',//优先享列表
  OfflineUcFixedDepositGet:WxApiRoot+'offlineUc/fixedDepositGet',//优先享详情
  OfflineUcGoldSafekeepingList:WxApiRoot+'offlineUc/goldSafekeepingList',//安享积存金列表
  OfflineUcGoldSafekeepingGet:WxApiRoot+'offlineUc/goldSafekeepingGet',//安享金详情
  OfflineUcRechargeList:WxApiRoot+'offlineUc/rechargeList',//充值列表
  OfflineUcRechargeGet:WxApiRoot+'offlineUc/rechargeGet',//充值详情


  CouponDetail: WxApiRoot + "coupon/detail", //获取优惠券详情
  GetGoodsQR: WxApiRoot + 'distribution/getGoodsQR', //获取分销图二维码
  GetGoodsQROnly: WxApiRoot + 'distribution/getGoodsQROnly', //获取分销图二维码

  ThirdSession: WxApiRoot + 'usercenter/thirdSession',

  MemberDetail: WxApiRoot + 'member/detail', //通用版会员详情
  MemberBecome: WxApiRoot + 'member/become', //通用版成为会员


  MaSkList: WxApiRoot + 'maSk/list', //秒杀列表
  MaSkDetail: WxApiRoot + 'maSk/detail', //秒杀详情
  MaSkSubmit: WxApiRoot + 'maSk/submit', //秒杀提交订单


  DistributionBalanceInfo: WxApiRoot + 'distributionBalance/info', //结算中心数据
  DistributionBalanceRecordList: WxApiRoot + 'distributionBalance/recordList', //收支明细
  DistributionBalanceTxList: WxApiRoot + 'distributionBalance/txList', //提现记录
  DistributionBalanceTx: WxApiRoot + 'distributionBalance/tx', //提现操作

  DistributionCheck: WxApiRoot + "distribution/check", //检查是否分销员
  DistributionAdd: WxApiRoot + 'distribution/add', //成为分销员下线
  DistributionBecome: WxApiRoot + 'distribution/become', //成为分销员
  DistributionGetQR: WxApiRoot + 'distribution/getQR', //获取分销小程序码
  DistributionIndex: WxApiRoot + 'distribution/distributionIndex', //分销员中心首页数据
  DistributionAchievements: WxApiRoot + 'distributionDetail/achievements', //业绩统计接口
  DistributionOrderList: WxApiRoot + 'distributionDetail/orderList', //个人推广商品订单列表
  DistributionOfflineList: WxApiRoot + 'distributionDetail/offlineList', //我的客户或下线接口
  DistributionGoodsList: WxApiRoot + 'distributionDetail/goodsList', //推广商品列表


  CardPass: WxApiRoot + "usercenter/cardPass", //支付密码看数据
  CardPay: WxApiRoot + "order/cardPay", //预付卡支付
  ZeroPay: WxApiRoot + "order/zeroPay", //零元支付
  //提货时间列表
  DeliveryList: WxApiRoot + "cart/deliveryList", // get {goodsId} 当商品为预售商品时要传goodsId
  //店铺模块接口
  StoreList: WxApiRoot + "store/list", //获取所有店铺地址
  //星享金接口
  EnjoyStarList: WxApiRoot + "enjoyStar/list", //获取星享金列表
  EnjoyStarDetail: WxApiRoot + "enjoyStar/detail", //获取单个星享金信息
  EnjoyStarOrder: WxApiRoot + "enjoyStar/order", //星享金下单（未支付）
  EnjoyStarPay: WxApiRoot + "enjoyStar/pay", //星享金支付订单
  EnjoyStarOrderList: WxApiRoot + "enjoyStar/orderList", //星享金订单列表
  EnjoyStarOrderDetail: WxApiRoot + "enjoyStar/orderDetail", //星享金订单详情

  //钱包接口
  Wallet: WxApiRoot + "usercenter/wallet", //获取钱包余额

  //我的会员卡接口
  User: WxApiRoot + "usercenter/user", //会员中心用户信息
  UnfiedOrder: WxApiRoot + "usercenter/unfiedOrder", //微信支付统一下单
  Reset: WxApiRoot + "usercenter/reset", //修改支付密码  也可做重置密码 传参不同
  RegCaptcha: WxApiRoot + "auth/regCaptcha", //修改支付密码时发送验证码。
  Bing: WxApiRoot + "usercenter/bing", //绑定会员卡（通过密码绑定 或者 通过验证码绑定）传参不同

  //签到接口
  SignList: WxApiRoot + "sign/list", //获取已签到的日期
  Sign: WxApiRoot + "sign/sign", //签到


  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口
  CatalogListGoods: WxApiRoot + "catalog/list", //分类与分类中的所有商品数据。

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号

  GoodsCount: WxApiRoot + 'goods/count', //统计商品总数
  GoodsList: WxApiRoot + 'goods/list', //获得商品列表
  GoodsCategory: WxApiRoot + 'goods/category', //获得分类数据
  GoodsDetail: WxApiRoot + 'goods/detail', //获得商品的详情
  GoodsRelated: WxApiRoot + 'goods/related', //商品详情页的关联商品（大家都在看）

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
  OrderCancel: WxApiRoot + 'order/cancel', //取消订单
  OrderRefund: WxApiRoot + 'order/refund', //退款取消订单
  OrderDelete: WxApiRoot + 'order/delete', //删除订单
  OrderConfirm: WxApiRoot + 'order/confirm', //确认收货
  OrderGoods: WxApiRoot + 'order/goods', // 代评价商品信息
  OrderComment: WxApiRoot + 'order/comment', // 评价订单商品信息

  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹

  UserFormIdCreate: WxApiRoot + 'formid/create', //用户FromId，用于发送模版消息

  GroupOnList: WxApiRoot + 'groupon/list', //团购列表
  GroupOn: WxApiRoot + 'groupon/query', //团购API-查询
  GroupOnMy: WxApiRoot + 'groupon/my', //团购API-我的团购
  GroupOnDetail: WxApiRoot + 'groupon/detail', //团购API-详情
  GroupOnJoin: WxApiRoot + 'groupon/join', //团购API-详情

  CouponList: WxApiRoot + 'coupon/list', //优惠券列表
  CouponMyList: WxApiRoot + 'coupon/mylist', //我的优惠券列表
  CouponSelectList: WxApiRoot + 'coupon/selectlist', //当前订单可用优惠券列表
  CouponReceive: WxApiRoot + 'coupon/receive', //优惠券领取
  CouponExchange: WxApiRoot + 'coupon/exchange', //优惠券兑换

  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,

  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  IssueList: WxApiRoot + 'issue/list', //帮助信息

};