import api from '@/common/api.js';
export default {
  //判断身份证是否被注册过
  checkId(data){
    return api.get('/exchangeApi/certification/overseas/check-id',data)
  },
  //实名认证等级一
  level1Auth(data) {
    return api.post('/exchangeApi/certification/overseas/level1-authentication',data)
  },
  //查询用户实名信息
  authenticationInfo(data){
    return api.get('/exchangeApi/certification/overseas/basic-authentication-info',data)
  }
}