import api from '@/common/api.js';
export default {
  //获取可用充值币种
  depositList() {
    return api.get('/exchangeApi/coin/deposit-coin-asset-list');
  },
  //获取可用提现币种
  withdrawList() {
    return api.get('/exchangeApi/coin/withdraw-coin-asset-list');
  },
  //获取充值地址
  getAddress(data) {
    return api.get('/exchangeApi/coin/transfer-in-address', data);
  },
  //获取提现最小提现或者手续费
  getFee(data) {
    return api.get('/exchangeApi/coin/withdraw-coinfee-query', data);
  },
  //普通提现-转到地址
  withdrawAddress(data,header){
    return api.post('/exchangeApi/coin/withdraw-coin',data,header)
  },
  //普通提现-转到用户
  withdrawUser(data,header){
    return api.post('/exchangeApi/coin/withdraw-coin-inner',data,header)
  },
  //提现记录
  withdrawOutList(data){
    return api.get('/exchangeApi/coin/withdraw-coin-details', data);
  },
  //充值记录
  depositOutList(data){
    return api.get('/exchangeApi/coin/deposit-coin-details', data);
  },
  //地址列表
  addressList(data){
    return api.get('/exchangeApi/coin/transfer-out-address-query',data)
  },
  //删除地址
  delAddress(data){
    return api.get('/exchangeApi/coin/transfer-out-address-delete',data);
  },
  //添加地址
  addAddress(data){
    return api.post('/exchangeApi/coin/transfer-out-address-add',data);
  },
  //同步资产
  syncMoney(data) {
    return api.get('/exchangeApi/coin/matchAsset', data);
  },
  //获取活动资产变化
  getActList(data) {
    return api.get('/exchangeApi/act/asset-change', data);
  },
  //获取活动资产变化
  assetDetail(data) {
    return api.get('/exchangeApi/cloudCompute/assetDetail', data);
  },
  //云算力划转
  assetToCloud(data,header) {
    return api.post('/exchangeApi/cloudCompute/assetToCloud', data,header);
  },
  //云算力划转记录
  assetTransRecord(data,header) {
    return api.get('/exchangeApi/cloudCompute/assetTransRecord', data,header);
  },
}
