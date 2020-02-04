import api from '@/common/api.js';
export default {
  /**
   * 出售单详情
   */
  sellDetailQuery(param) {
    return api.get('/c2cApi/c2cselladvert/advert-detail', param);
  },
  /**
   * 收购单单详情
   */
  buyDetailQuery(param) {
    return api.get('/c2cApi/c2cbuyadvert/advert-detail', param);
  },
  //查询C2C支付绑定
  getC2cPayInfo() {
    return api.get('/c2cApi/payconfig/c2cinfo-query');
  },
  // 创建购买订单
  createAdOrder(param = {}, header = {}) {
    return api.post('/c2cApi/c2ctransaction/order-ensure', param, header);
  },
  // 创建出售订单
  createSellOrder(param = {}, header = {}) {
    return api.post('/c2cApi/c2CTransactionPurchase/order-ensure', param, header);
  },
  //查询交易成功订单
  c2cOrderInfo(param = {}, header = {}) {
    return api.get('/c2cApi/c2ctransaction/order-detail', param, header);
  },
  /***
   * 我的订单查询
   * **/
  orderQuery(param = {}) {
    return api.get("/c2cApi/c2ctransactionorderinfo/order-query", param);
  },
  /***
   * 取消訂單
   * **/
  buyOrderCancel(param = {}) {
    return api.get("/c2cApi/c2ctransaction/order-cancel", param);
  },
   /***
   * 訂單確認支付-售卖区
   * **/
  buyOrderPay(param = {}, header = {}) {
    return api.get("/c2cApi/c2ctransaction/order-pay", param, header);
  },
  /***
   * 訂單確認支付-收购区
   * **/
  sellOrderPay(param = {}, header = {}) {
    return api.get("/c2cApi/c2CTransactionPurchase/ensure-pay", param, header);
  },
  /***
   * 出售区申述
   * **/
  orderComplaintSell(param = {}) {
    return api.post("/c2cApi/c2ccomplaint/complaint-add", param);
  },
  //收购区申述
  orderComplaintBuy(param = {}) {
    return api.post("/c2cApi/c2ccomplaint/purchase-complaint-add", param);
  },
  /***
   * 訂單確認打幣-售卖区
   * **/
  sellOrderEnsure(param = {}, header = {}) {
    return api.get("/c2cApi/c2CTransactionPurchase/transfer-ensure", param, header);
  },
  /***
   * 訂單確認打幣-收购区
   * **/
  buyOrderEnsure(param = {}, header = {}) {
    return api.get("/c2cApi/c2ctransaction/transfor-ensure", param, header);
  },
  /**
   * 出售查询
   */
  sellAdvertQuery(param = {}) {
    return api.get("/c2cApi/c2cselladvert/advert-query", param);
  },

  /**
   * 收购查询
   */
  buyAdvertQuery(param = {}) {
    return api.get("/c2cApi/c2cbuyadvert/advert-query", param);
  },
  /***
   * 我的出售发布
   * **/
  myAdvertQuerySell(param = {}) {
    return api.get("/c2cApi/c2cselladvert/myadvert-query", param);
  },
  //我的收购发布
  myAdvertQueryBuy(param = {}) {
    return api.get("/c2cApi/c2cbuyadvert/myadvert-query", param);
  },
  /***
   * 出售发布刪除
   * **/
  sellAdvertDelete(param = {}) {
    return api.get('/c2cApi/c2cselladvert/advert-remove', param);
  },
  /***
   * 收购发布刪除
   * **/
  buyAdvertDelete(param = {}) {
    return api.get('/c2cApi/c2CTransactionPurchase/order-cancel', param);
  },
  /**
   * 售卖获取基本信息
   * 包括：
   *  币种列表、国家、货币、支付宝信息、银行卡信息
   */
  getSellInfo(param = {}) {
    return api.get("/c2cApi/c2cselladvert/get-info", param);
  },
  //获取发布收购基本信息
  getBuyInfo(param = {}) {
    return api.get("/c2cApi/c2cbuyadvert/get-info", param);
  },
  /**
   * 创建卖单
   */
  createAdSell(param = {}, header = {}) {
    return api.post("/c2cApi/c2cselladvert/info-deploy", param, header);
  },
  /**
   * 创建收购单
   */
  createAdBuy(param = {}, header = {}) {
    return api.post("/c2cApi/c2cbuyadvert/advert-deploy", param, header);
  },
  /***
   * 卖家强制打币给买家-承兑商
   * **/
  forceTransforCoinMember(param = {}, header = {}) {
    return api.get("/c2cApi/c2ccomplaint/complaint-ensure", param, header);
  },
  /***
   * 卖家强制打币给买家-普通用户
   * **/
  forceTransforCoinOrdinary(param = {}, header = {}) {
    return api.get("/c2cApi/c2ccomplaint/purchase-complaint-ensure", param, header);
  },
  //查询会员详情
  memberConfigInfo(data) {
    return api.get('/c2cApi/goldenTransaction/memberConfigInfo', data);
  },
  //申请成为会员
  userApplyMember(data) {
    return api.get('/c2cApi/goldenTransaction/userApplyMember', data);
  },
}
