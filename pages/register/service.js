import api from '@/common/api.js';
export default {
  //手机号注册
  phoneAccount(data, header) {
    return api.post('/exchangeApi/user/phone-register', data, header)
  },
  //邮箱预注册
  preRegister(param = {}, header = {}) {
    return api.post('/exchangeApi/user/email-pre-register', param, header)
  },
}
