import api from '@/common/api.js';
export default {
  //获取我的收到
  getReceive(data) {
    return api.get('/exchangeApi/red/gain-record', data)
  },
  //获取我的发出
  getDistribute(data) {
    return api.get('/exchangeApi/red/provided-record', data)
  },
  //派发红包
  provided(data, header) {
    return api.post('/exchangeApi/red/provided', data, header)
  },
  //领红包接口
  gain(data) {
    return api.get('/exchangeApi/red/gain', data)
  },
  //红包领取信息
  getAllrecord(data) {
    return api.get('/exchangeApi/red/allot-record', data)
  },
}
