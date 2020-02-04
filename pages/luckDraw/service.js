import api from '@/common/api.js';
export default {
  //领红包接口
  gain(data) {
    return api.get('/exchangeApi/red/gain', data)
  },
  //红包领取信息
  getAllrecord(data) {
    return api.get('/exchangeApi/red/allot-record', data)
  },
}
