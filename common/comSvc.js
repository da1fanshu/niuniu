import api from '@/common/api.js'
export default {
  //获取验证码
  getCode(data, header) {
    return api.post('/exchangeApi/service/code', data, header)
  },
  //获取24H价格
  getTrade() {
    return api.get('/trade/detail');
  },
  //获取买买盘数据
  getBuySell(data) {
    return api.get('/trade/trade', data)
  },
  //获取交易盘记录
  getPanInfo(data){
    return api.get('/trade/info', data)
  },
  //获取用户资产
  getAssets() {
    return api.get('/exchangeApi/asset/accounts');
  },
}
