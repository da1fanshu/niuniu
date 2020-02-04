import api from '@/common/api.js';
export default {
  //重置密码
  resetLogin(data,header){
    return api.post('/exchangeApi/user/login-password',data,header)
  }
}