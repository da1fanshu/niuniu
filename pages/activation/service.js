import api from '@/common/api.js';
export default {
  RegisterActive(data) {
    return api.get('/exchangeApi/user/email-activate', data)
  }
}
