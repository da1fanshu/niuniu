import Vue from 'vue'
import Vuex from 'vuex'
import service from './service.js'
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    user: {
      account: null,
      accountBSD: null,
      authLevel: null,
      c2cMember: '',
      confirm: null,
      member: null,
      mobile: null,
      name: null,
      nickname: null,
      passwort: null,
      setPayPassword: null,
      states: null,
      uid: 0,
      userInfoExtend: null,
      weChatNo: null,
    },
    coinRMB: {},
    assets: [],
    imgList: [],
    userState: 0,
    userGoogle: {},
    isExchange:false,
    isPan:false,
    appVersion:{},
    Version:{},
    coinAddress:'',
    closeDown:false,
    coinConfig:{
      c2c:[],
      exchange:[],
      asset:{}
    },
  },
  getters: {
    IMGLIST: (state) => {
      // #ifdef APP-PLUS
      state.imgList.map((e, i) => {
        e.imageAddress = service.baseUrl + e.imageAddress;
      })
      // #endif
      return state.imgList;
    },
    AVOID: (state) => {
      return state.userState.states;
    },
    GOOGLE: (state) => {
      return state.userGoogle;
    },
    USERINFO: (state) => {
      return state.user;
    },
    COINRMB:(state) => {
      return state.coinRMB;
    },
    EXCHANGE:(state) => {
      return state.isExchange;
    },
    PAN:(state)=>{
      return state.isPan;
    },
    APPVERSION:(state)=>{
      return {
        old:state.Version,
        renew:state.appVersion
      };
    },
    COINCONFIG:(state)=>{
      return state.coinConfig;
    }
  },
  mutations: {
    setCloseDown(state,val){
      state.closeDown = val;
    },
    setAddress(state,val){
      state.coinAddress = val;
    },
    setUSDT(state, val) {
      state.USDT = val
    },
    setUserInfo(state, val) {
      state.user = val;
    },
    setAssets(state, val) {
      state.assets = val;
    },
    setUserState(state, val) {
      state.userState = val;
    },
    setUserGoogle(state, val) {
      state.userGoogle = val;
    },
    setIsExchange(state, val){
      state.isExchange = val;
    },
    setIsPan(state, val){
      state.isPan = val;
    },
    setAppVersion(state,val){
      state.appVersion = val;
    },
    setVersion(state,val){
      state.Version = val;
    }
  },
  actions: {
    //获取最新APP版本ID
    getAppId({state,commit}){
      service.getAppId({device: 'ANDROID'}).then(({data})=>{
        if(data.code == '100200'){
          commit('setAppVersion',data.data);
        }
      })
    },
    //初始化
    inits({
      state,
      dispatch
    }) {
      // 获取服务器文件配置币种
      uni.request({
        url:service.coinUrl,
        success: (data) => {
          state.coinConfig = data.data;
        }
      })
      
      // 判断是否登录请求用户数据
      let loginTime = uni.getStorageSync('LOGIN_TIME');
      if (Number(loginTime) > new Date().getTime()) {
        let token = uni.getStorageSync('TOKEN');
        if (token) {
          dispatch('getBasic');
          dispatch('getUserState');
          dispatch('getGoogle');
        }
      } else {
        uni.removeStorageSync('LOGIN_TIME');
        uni.removeStorageSync('TOKEN');
      }
      service.getUSDT().then(({
        data
      }) => {
        if (data.code == '100200') {
		  let regEx = /[^\d|^\.|^\-]/g;
          for(let i in data.data){
            data.data[i] = data.data[i].replace(regEx,"") * 1;
          }
          state.coinRMB = data.data;
        }
      })
      
      service.getImageList().then(({
        data
      }) => {
        if (data.code == '100200') {
          state.imgList = data.data;
        }
      })
    },
    //获取用户是否开启谷歌验证码
    getGoogle({
      state,
      commit
    }) {
      service.googleCodeQuery().then(({
        data
      }) => {
        if (data.code == '100200') {
          commit('setUserGoogle', data.data)
        }
      })
    },
    //获取用户是否开启免密支付
    getUserState({
      state,
      commit
    }) {
      service.getUserState().then(({
        data
      }) => {
        if (data.code == '100200') {
          commit('setUserState', data.data)
        }
      })
    },
    //获取用户信息
    getBasic({
      state,
      commit
    }) {
      service.getBasic().then(({
        data
      }) => {
        if (data.code == '100200') {
          commit('setUserInfo', data.data)
        }
      })
    }
  }
})
store.dispatch('inits');
export default store
