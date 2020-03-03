let baseUrl = '';
// #ifdef APP-PLUS
baseUrl = 'http://nnex.io';//生产服务器域名
// #endif

//格式化请求头
const formatHeader = (header = []) => {
  let auth = []
  //判断是否登录
  if (uni.getStorageSync('TOKEN')) {
    auth.push('token=' + uni.getStorageSync('TOKEN'));
  }
  for (let i in header) {
    auth.push(i + '=' + header[i]);
  }
  auth = auth.join(',');
  return auth
};
let headers = {
  "Content-Type": 'application/json; charset=UTF-8',
  "accept-language": 'zh-CN',
}
let get = (url, data, header) => {
  headers.authorization = formatHeader(header);
  let objData = Object.assign({
    brokerId: '10003'
  }, data);
  return uni.request({
    url: baseUrl + url,
    data: objData,
    method: 'GET',
    header: headers
  }).then(data => {
    let [err, res] = data;
    if (url.indexOf('/trade/') > -1) {
      return {
        data: res.data
      };
    }
    if (err || res.statusCode != 200) {
      uni.showToast({
        icon: 'none',
        title: '网络异常，请稍后重试',
        position: 'bottom'
      })
      return {
        data: {
          code: '',
          data: null,
          msg: '网络异常，请稍后重试'
        }
      }
    }
    if (res.data.code == '105108' || res.data.code == '105102') {
      uni.showModal({
        title: '提示',
        content: '登录会话超时，请重新登录',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return {
        data: {
          code: '',
          data: null,
          msg: '登录会话超时，请重新登录'
        }
      }
    }
    return {
      data: res.data
    }
  })
};
let post = (url, data, header) => {
  headers.authorization = formatHeader(header);
  let objData = Object.assign({
    brokerId: '10003'
  }, data);
  return uni.request({
    url: baseUrl + url,
    data: objData,
    method: 'POST',
    header: headers
  }).then(data => {
    let [err, res] = data;
    if (err || res.statusCode != 200) {
      uni.showToast({
        icon: 'none',
        title: '网络异常，请稍后重试',
        position: 'bottom'
      })
      return {
        data: {
          code: '',
          data: null,
          msg: '网络异常，请稍后重试'
        }
      }
    }
    if (res.data.code == '105108' || res.data.code == '105102') {
      uni.showModal({
        title: '提示',
        content: '登录会话超时，请重新登录',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return {
        data: {
          code: '',
          data: null,
          msg: '登录会话超时，请重新登录'
        }
      }
    }
    return {
      data: res.data
    }
  });
}

//查询是否登录
let isLogin = () => {
  let loginTime = uni.getStorageSync('LOGIN_TIME');
  return Number(loginTime) > new Date().getTime() ? true : false;
}

//未登录提示去登录
let goLogin = (page) => {
  uni.showModal({
    title: '提示',
    content: '请登录后进行操作',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        uni.navigateTo({
          url: page
        });
      }
    }
  });
}

let showLoading = () => {
  uni.showLoading({
    title: '加载中...',
    mask: true
  })
}
let hideLoading = () => {
  uni.hideLoading();
}

//生成订单唯一
let outOrder = () => {
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export default {
  get,
  post,
  baseUrl,
  isLogin,
  goLogin,
  showLoading,
  hideLoading,
  outOrder,
  // 币种图片服务器路径
  coinImgUrl:'https://whole.winmax.me/coinImg/',//生成环境
}
