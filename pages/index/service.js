import api from '@/common/api.js';
export default {
  //获取公告资讯
  getNewList(data){
    return api.get('/bera-manage/news/news-list', data);
  },
  //获取云算力登录
  getCloudInfo(data){
    return api.get('/exchangeApi/cloudCompute/getCloudInfo', data);
  },  
  //获取交易对信息
  getConfigSymbolRank() {
  	return api.get('/exchangeApi/configSymbol-Operate/getConfigSymbolRank');
  },
  /**
   * 查询所有交易对的配置
   * @param param
   * @returns {*}
   */
  symbolConfigList() {
  	return api.get('/exchangeApi/match/symbolprofiles');
  },
  //获取USDT价格
  getUSDT() {
  	return api.get('/exchangeApi/configSymbol-Operate/getSymbolUsdtPrice');
  },
}