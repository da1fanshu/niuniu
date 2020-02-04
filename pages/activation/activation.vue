<template>
  <view class="content">
    <view class="activation" v-if="!loading">
      <view class="authentication_lv">
        <view class="lv_top">
          <image v-if="userInfo.auditStatus == 'INIT'" src="/static/dev/lv_init.png" style="height: 80upx; width: 80upx;" mode=""></image>
          <image v-else src="/static/dev/lv_fail.png" style="height: 80upx; width: 80upx;" mode=""></image>
          <text style="font-size: 28upx; line-height: 82upx; color: #03bcc0;">{{userInfo.auditStatus == 'INIT' ? '激活成功' : '激活失败'}}</text>
          <template v-if="userInfo.auditStatus == 'INIT'">
            <text>您的账户已激活成功</text>
          </template>
          <template v-else>
            <text>您的账户已激活失败，请重新注册</text>
          </template>
        </view>
        <view class="lv_buttom">
          <button :class="userInfo.auditStatus != 'INIT' ? 'err' : ''" @click="goPage">{{userInfo.auditStatus == 'INIT' ? '前往登录' : '重新注册'}}</button>
        </view>
      </view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
  import service from './service.js';
  import HMmessages from '@/components/HM-messages/HM-messages.vue';
  export default {
    components: {
      HMmessages
    },
    data() {
      return {
        userInfo: {
          auditStatus: ''
        },
        userPreRegistrationId:'',
        randomCode:'',
        loading:true,
      };
    },
    onBackPress(options) {
      if (options.from === 'navigateBack') {
        return false;
      }
      this.back();
      return true;
    },
    onLoad(option) {
      if(option && option.code && option.id){
        this.randomCode = option.code;
        this.userPreRegistrationId = option.id;
        this.RegisterActive();
      }else{
        uni.showModal({
          title:'提示',
          content:'注册链接有误，请检查后重试！',
          showCancel:false
        })
      }
    },
    methods:{
      //前往页面
      goPage(){
        if(this.userInfo.auditStatus == 'INIT'){
          uni.redirectTo({
            url:'../login/login'
          })
        }else{
          uni.redirectTo({
            url:'../register/register'
          })
        }
      },
      //验证信息
      RegisterActive(){
        this.loading = true;
        service.RegisterActive({
          userPreRegistrationId:this.userPreRegistrationId,
                randomCode:this.randomCode
        }).then(({data})=>{
          this.loading = false;
          if(data.code == '100200'){
            this.userInfo.auditStatus = 'INIT';
          }else{
            this.userInfo.auditStatus = 'ERROR';
            this.errors(data.msg)
          }
        })
      },
      //错误提示
      errors(text) {
        this.HMmessages.show(text, {
          textAlign: 'center',
          background: '#74272d',
          fontColor: '#fff'
        });
      },
      //修改手机返回
      back() {
        let length = getCurrentPages();
        if (length.length == 1) {
          uni.switchTab({
            url: '../index/index'
          });
        } else {
          uni.navigateBack();
        }
      }
    }
  }
</script>

<style lang="scss">
  @import './style.scss';
</style>
