import api from '@/common/api.js';
export default {
  //修改登录密码
  resetPwd(data, header) {
    return api.post('/exchangeApi/user/login-password', data, header);
  },
  //设置或者重置资金密码
  resetPayPwd(data, header) {
    return api.post('/exchangeApi/user/paypassword-init', data, header);
  },
  //修改资金密码
  changePayPwd(data, header) {
    return api.post('/exchangeApi/user/pay-password', data, header)
  },
  //开启或关闭免密支付
  exemptionPayPwd(data, header) {
    return api.get('/exchangeApi/user/User-update', data, header)
  },
  //设定手机号
  setPhone(data, header) {
    return api.get('/exchangeApi/user/cellphone-config', data, header)
  },
  //第一次开启谷歌验证
  getGoogelCode() {
    return api.get('/exchangeApi/user/googlecode-get');
  },
  //绑定谷歌验证器
  bingGoogle(data, header) {
    return api.get('/exchangeApi/user/googlecode-firstcheck', data, header)
  },
  //设置谷歌验证码关闭
  setGoogleOff(data, header) {
    return api.get('/exchangeApi/user/googlecode-off', data, header)
  },
  setGoogleOn(data, header) {
    return api.get('/exchangeApi/user/googlecode-on')
  },
  //设置昵称
  setNickName(data) {
    return api.get('/exchangeApi/user/nickname-config', data)
  },
  //获取消息列表
  getMessageList(data) {
    return api.get('/exchangeApi/user/message', data)
  },
  //查询C2C支付绑定
  getC2cPayInfo() {
    return api.get('/c2cApi/payconfig/c2cinfo-query');
  },
  //修改支付宝设置
  setAlipay(data, header) {
    return api.post('/c2cApi/payconfig/c2calipay-config', data, header)
  },
  //修改银行卡设置
  setBank(data, header) {
    return api.post('/c2cApi/payconfig/c2cbank-config', data, header)
  },
  //获取邀请码
  getCode(){
    return api.get('/exchangeApi/bonus-point/getInviteCode')
  },
  //获取邀请列表
  getInviteList(data){
    return api.get('/exchangeApi/user/invite-list',data)
  },
  //获取币种列表
  getCodeList(data){
    return api.get('/exchangeApi/coinLock/getAllLockAssetCode',data)
  },
  //获取解冻记录
  getAllList(data){
    return api.get('/exchangeApi/userAssetChange/selectUserLockInfoByRules',data)
  }
  
}