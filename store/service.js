import api from '@/common/api.js';
export default {
  //服务器存放的配置文件
  coinUrl:'https://whole.lkex.co/coinConfig.json',//生产环境
  
  baseUrl:api.baseUrl,
  //获取用户信息
  getBasic() {
    return api.get('/exchangeApi/user/basic')
  },
  //获取USDT价格
  getUSDT(){
    return api.get('/exchangeApi/configSymbol-Operate/getSymbolUsdtPrice');
  },
  //获取图片列表
  getImageList(data){
    return api.get('/bera-manage/bTopScrollImage/image-list', data);
  },
  //是否开启免密支付
  getUserState(){
    return api.get('/exchangeApi/user/User-state');
  },
  //查询用户是否开启谷歌验证码
  googleCodeQuery(){
    return api.get('/exchangeApi/user/googlecode-query');
  },
  getAppId(data){
    return api.get('/bera-manage/app/latest',data);
  }
}