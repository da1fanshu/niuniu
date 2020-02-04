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
}