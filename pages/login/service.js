import api from '@/common/api.js';
export default{
  //手机号登录
  phoneLogin(data,header){
    return api.get('/exchangeApi/user/phone-login',data,header)
  },
  //邮箱登录
  emailLogin(data,header){
    return api.get('/exchangeApi/user/login',data,header)
  },
  //验证账户
  needCaptha(data){
    return api.get('/exchangeApi/user/need-captha',data);
  },
  //CID设备绑定
  pushAdd(data) {
    return api.get('/bera-manage/app/push-add', data);
  },
}