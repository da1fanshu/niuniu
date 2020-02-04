<template>
  <view class="content invitation">
    <image class="bg" src="/static/dev/invitation_bg.png" mode=""></image>
    <view class="invitation_main">
      <view class="main_title">我的专属邀请码</view>
      <view class="main_code">{{ code }}</view>
      <view class="main_button clear">
        <button class="fl" @click="copy(code)">点击复制邀请码</button>
        <button class="fr" @click="copy(address)">点击复制邀请链接</button>
      </view>
      <view class="main_qrcode"><tki-qrcode ref="qrcode" :val="address" :loadMake="true" :onval="true" :size="246" /></view>
      <view class="main_tips">向好友分享您的邀请码或专属二维码</view>
      <view class="main_tips" style="color: #4d67ef;">最新资讯、运营奖励等多重好礼享不停！</view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
import service from '../service.js';
export default {
  components: {
    tkiQrcode,
    HMmessages
  },
  data() {
    return {
      code: '',
      address: 'https://lkex.co' + `/#/pages/register/register?code=${this.code}`
    };
  },
  onShow() {
    if (this.$api.isLogin()) {
      this.getCode();
      return false;
    }
    this.$api.goLogin('../../login/login');
  },
  onNavigationBarButtonTap(e) {
    if (e.type != 'share') {
      uni.navigateTo({
        url: 'inviteList/inviteList'
      });
    } else {
      let text = 'lkex是在2017年由共赢集团领投，多位数字资产爱好者创建而成，它是一个专注区块链资产兑换平台。公司总部在马来西亚吉隆坡，为全球用户提供便捷的数字资产兑换环境，在各国法律框架下合规运营，保障用户资产100%安全，平台使用多重签名+冷热分离的安全方案。提供高端而又安全的交易环境和专业优质的客户服务，赢得行业用户的口碑！';
      let imgUrl = 'https://lkex.co/' + '/bera-manage/news/image-get?id=5d5a4be5496b6905596083a5';
      let that = this;
      let arr =  ['分享到微信好友', '分享到微信朋友圈', '复制邀请链接', '取消分享'];
      // #ifdef H5
      arr = ['复制邀请链接'];
      // #endif
      uni.showActionSheet({
        itemList: arr,
        success: function(res) {
          // #ifdef APP-PLUS
          if (res.tapIndex == 0) {
            uni.share({
              provider: 'weixin',
              scene: 'WXSceneSession',
              type: 0,
              href: that.address,
              title: 'lkex邀请您注册玩转区块链',
              summary:text,
              imageUrl: imgUrl,
              success: function(res) {
                
              },
              fail: function(err) {
                
              }
            });
          }else if(res.tapIndex == 1){
            uni.share({
                provider: "weixin",
                scene: "WXSenceTimeline",
                type: 0,
                href: that.address,
                title: "lkex邀请您注册玩转区块链",
                summary: text,
                imageUrl: imgUrl,
                success: function (res) {
                    
                },
                fail: function (err) {
                    
                }
            });
          }else if(res.tapIndex == 2){
            that.copy(that.address);
          }
          // #endif
          // #ifdef H5
          if (res.tapIndex == 0) {
            that.copy(that.address);
          }
          // #endif
          // console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
        },
        fail: function(res) {
          // console.log(res.errMsg);
        }
      });
    }
  },
  methods: {
    //获取邀请码
    getCode() {
      service.getCode().then(({ data }) => {
        if (data.code == '100200') {
          this.code = data.data;
          this.address = 'https://lkex.co' + `/#/pages/register/register?code=${this.code}`;
        } else {
          this.errors(data.msg);
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
    //复制
    copy(text) {
      let that = this;
      uni.setClipboardData({
        data: text,
        success: () => {
          that.HMmessages.show('复制成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
