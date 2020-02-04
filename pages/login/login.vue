<template>
  <view class="content">
    <!-- #ifdef APP-PLUS -->
    <view class="status_bar">
      <view class="top_view"></view>
    </view>
    <!-- #endif -->
    <view class="login_mian">
      <image @click="goPageIndex()" src="/static/logo.png" style="width: 178upx; height: 178upx; margin: 164upx auto 0; display: block;" mode=""></image>
      <view class="login_form">
        <view class="item clear">
          <view class="fl">
            <image src="/static/login_user.png" style="width: 24upx; height: 26upx;" mode=""></image>
          </view>
          <input class="fr" @blur="blurAccount()" v-model="account" type="text" placeholder="手机号码/邮箱" />
        </view>
        <view class="item clear">
          <view class="fl">
            <image src="/static/login_pwd.png" style="width: 24upx; height: 26upx;" mode=""></image>
          </view>
          <input class="fr" v-model="password" type="password" placeholder="请输入密码" />
        </view>
        <view class="item imgCode clear" v-if="imgCode">
          <view class="fl">
            <image src="/static/login_pwd.png" style="width: 24upx; height: 26upx;" mode=""></image>
          </view>
          <view class="code" @click="getImgCode()">
            <image :src="imgUrl" style="width: 100%; height: 54upx;" mode=""></image>
          </view>
          <input class="fr" v-model="code" type="number" placeholder="请输入图片验证码" maxlength="4" />
        </view>
        <view class="mark" @click="isMark = !isMark">
          <view class="checkbox">
            <template v-if="isMark">
              <icon type="success_no_circle" color="#fff" size="10"/>
            </template>
          </view>
          <text>是否记住登录密码</text>
        </view>
        <view class="item submit" v-if="loading == false"><button @click="submits()">登录</button></view>
        <view class="item submit" v-else><button disabled :loading="true" style="opacity: 0.5;">登录</button></view>
        <view class="clear footer">
          <button plain class="fl" @click="$goPage('../reset/reset')">重置密码</button>
          <button plain class="fr" @click="$goPage('../register/register')">注册</button>
        </view>
      </view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
  import service from './service.js';
  import HMmessages from '@/components/HM-messages/HM-messages.vue';
  import {
    REG_EMAIL_PHONE,
    REG_EMAIL,
    REG_PHONE
  } from '@/common/reg.js';
  import {
    uniIcon
  } from '@dcloudio/uni-ui';
  export default {
    components: {
      HMmessages,
      uniIcon
    },
    data() {
      return {
        isMark: false,
        account: '',
        password: '',
        imgCode: false,
        code: '',
        randomKey: '',
        imgUrl: '',
        loading: false
      };
    },
    onBackPress(options) {
      if (options.from === 'navigateBack') {
        return false;
      }
      this.back();
      return true;
    },
    onLoad() {
      uni.removeStorageSync('LOGIN_TIME');
      uni.removeStorageSync('TOKEN');
      this.getImgCode();
      this.account = uni.getStorageSync('account') ? uni.getStorageSync('account') : '';
      let off = uni.getStorageSync('markInfo') ? true : false;
      if (off) {
        this.password = JSON.parse(uni.getStorageSync('markInfo')).pwd;
        this.isMark = true;
      } else {
        this.isMark = false;
        this.password = '';
      }
    },
	watch: {
	    account: function() {
	        const reg= /\s/;
	        if(reg.test(this.account)){
	            this.account = this.account.replace(reg,'');
	            return;
	        }
	    },
		password: function() {
		    const reg= /\s/;
		    if(reg.test(this.password)){
		        this.password = this.password.replace(reg,'');
		        return;
		    }
		},
		code: function() {
		    const reg= /\s/;
		    if(reg.test(this.code)){
		        this.code = this.code.replace(reg,'');
		        return;
		    }
		},
	},
    methods: {
      goPageIndex() {
        uni.switchTab({
          url: '../index/index'
        })
      },
      //验证账户
      blurAccount() {
        if (this.account) {
          if (REG_EMAIL_PHONE.test(this.account)) {
            let type = '';
            let num = '';
            if (REG_EMAIL.test(this.account)) {
              type = 'EMAIL';
            } else {
              type = 'PHONE';
              num = '86';
            }
            service
            .needCaptha({
              userName: num + this.account,
              type
            })
            .then(({
              data
            }) => {
              if (data.code == '100200') {
                this.imgCode = false;
              } else if (data.code == '104102') {
                this.errors('该账户未注册');
              } else if (data.code == '105104') {
                if (data.data && data.data.num && data.data.num < 10) {
                  this.imgCode = true;
                } else if (data.data && data.data.num && data.data.num >= 10) {
                  this.errors('您的帐号已经锁定，请重置您的登录密码');
                }
              }
            });
          } else {
			  this.errors('请输入正确的手机号码或邮箱')
		  }
        }
      },
      //获取图片验证码
      getImgCode() {
        this.randomKey = new Date().getTime();
        this.imgUrl = '/exchangeApi/captchar/code?randomKey=' + this.randomKey;
        // #ifdef APP-PLUS
        this.imgUrl = this.$api.baseUrl + '/exchangeApi/captchar/code?randomKey=' + this.randomKey;
        // #endif
      },
      //验证
      inits() {
        if (!this.account) {
          this.errors('请输入手机号或者邮箱');
          return false;
        }
        if (!REG_EMAIL_PHONE.test(this.account)) {
          this.errors('请输入正确的手机号或者邮箱');
          return false;
        }
        if (!this.password) {
          this.errors('请输入登录密码');
          return false;
        }
        if (this.imgCode) {
          if (!this.code) {
            this.errors('请输入验证码');
            return false;
          }
        }
        return true;
      },
      //手机号登录
      submits() {
        if (!this.inits()) {
          return false;
        }
        this.loading = true;
        let num = '';
        if (REG_PHONE.test(this.account)) {
          num = '86';
        }
        let name = REG_EMAIL.test(this.account) ? 'emailLogin' : 'phoneLogin';
        let header = {
          'login-password': this.password,
          'account-no': num + this.account
        };
        if (this.imgCode) {
          header['captchar-code'] = this.code;
          header['captchar-no'] = this.randomKey;
        }
        service[name]({}, header).then(({
          data
        }) => {
          this.loading = false;
          if (data.code == '100200') {
            let that = this;
            uni.setStorage({
              key: 'account',
              data: that.account
            });
            uni.setStorageSync('LOGIN_TIME', new Date(new Date().getTime() + 1 * 60 * 60 * 1000).getTime() + '');
            uni.setStorageSync('TOKEN', data.data.token);
            // #ifdef APP-PLUS
            let device = uni.getSystemInfoSync().platform ? "ANDROID" : "IOS";
            // let cid = plus.push.getClientInfo().clientid;
            // service.pushAdd({
            //   device: device,
            //   cid: cid
            // }).then(({
            //   data
            // }) => {
            //   console.log(data)
            // })
            // #endif
            this.$store.dispatch('getBasic');
            this.$store.dispatch('getUserState');
            this.$store.dispatch('getGoogle');
            if (this.isMark) {
              uni.setStorage({
                key: 'markInfo',
                data: JSON.stringify({
                  account: that.account,
                  pwd: that.password
                })
              });
            } else {
              uni.removeStorageSync('markInfo');
            }
            this.back();
          } else {
            this.getImgCode();
            if (data.data && data.data.num >= 3 && data.data.num < 10) {
              this.imgCode = true;
            } else if (data.code == "105104") {
              this.imgCode = true;
            }
            if (data.code == '104102') {
              this.errors(name == 'emailLogin' ? '邮箱未注册' : '手机号未注册')
            } else {
              this.errors(data.msg);
            }
          }
        });
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
  };
</script>

<style lang="scss">
  @import './style.scss';
</style>
