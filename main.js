import Vue from 'vue'
import App from './App'
import store from './store'
Vue.prototype.$store = store
import api from './common/api.js';
import './js_sdk/ican-H5Api/ican-H5Api.js'
Vue.prototype.$api = api

Vue.config.productionTip = false

function formta(date, fmt) {
  if(!date){
    return date;
  }
  var a = null;
  var dates = null;
  if (typeof date == 'object') {
    dates = date;
  }else if(Number(date)){
    dates = new Date(date);
  } else {
    a = date.split(/[^0-9]/);
    dates = new Date(a[0], a[1] - 1, a[2] , a[3] ? a[3] :'', a[4] ? a[4] :'', a[5] ? a[5] :'');
  }

  var o = {
    "M+": dates.getMonth() + 1, //月份   
    "d+": dates.getDate(), //日   
    "h+": dates.getHours(), //小时   
    "m+": dates.getMinutes(), //分   
    "s+": dates.getSeconds(), //秒   
    "q+": Math.floor((dates.getMonth() + 3) / 3), //季度   
    "S": dates.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function lockNum(value) {
  if (value >= 10000) {
    value = Math.round(value / 10000 * 100) / 100 + 'w';
  } else if (value >= 1000) {
    value = Math.round(value / 1000 * 100) / 100 + 'k';
  } else {
    value = value;
  }
  return value;
}

Vue.prototype.$formta = formta;
Vue.prototype.$lockNum = lockNum;
Vue.prototype.$goPage = (page) => {
  uni.navigateTo({
    url: page
  })
};


App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
