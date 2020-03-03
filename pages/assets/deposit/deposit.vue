<template>
  <view class="content">
    <view class="deposit">
      <view class="deposit_main">
        <view class="deposit_code">
          <tki-qrcode ref="qrcode" :val="address" :loadMake="true" :onval="true" />
        </view>
        <view class="deposit_tpis">
          <text>充币地址请勿充值其他数字资产</text>
        </view>
		<view class="deposit_address">
			{{ address }}
		</view>
		<view class="copy" @click="copy">
			复制链接
		</view>
      </view>
      <view class="deposit_sync" v-if="coin==='SWTC'|| coin==='WKT' ||coin==='NTCC' ||coin==='TCC' ||coin==='MAE' || coin==='CALL'">
        <button @click="syncMoney(coin)">同步资产</button>
      </view>
      <view class="tip">
        <view class="deposit_tips_one">禁止充提{{ coin }}之外的其他资产，非{{ coin }}资产转币充值的该地址将丢失，不可找回。</view>
        <view class="deposit_tips_two">
          1. 本站 {{coin}} 的钱包地址底层链为 {{COINCONFIG.asset[coin]}}。
        </view>
        <view class="deposit_tips_two">
          2. 往该地址充币，等待区块网络自动确认 (5个确认) 后，本系统会自动入账。
        </view>
        <view class="deposit_tips_two">
          3. 为了快速到账，转币时可适当提高旷工手续费。
        </view>
      </view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
  import HMmessages from '@/components/HM-messages/HM-messages.vue';
  import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
  import service from '../service.js';
  import { mapGetters } from 'vuex';
  export default {
    components: {
      HMmessages,
      tkiQrcode
    },
    data() {
      return {
        address: '',
        coin: ''
      };
    },
    computed: {
      ...mapGetters(['COINCONFIG'])
    },
    onLoad(option) {
      if (option && option.type) {
        uni.setNavigationBarTitle({
          title: option.type + '充币'
        })
        this.coin = option.type;
        this.getAddress();
      }
    },
    onShow() {
      if(this.coin == 'EOS'){
        uni.showModal({
          title:'充值提示',
          content:'EOS充值需要备注本平台ID，账户，如充值时不进行备注，将无法到账，本平台概不负责。',
          showCancel:false
        })
      }
    },
    methods: {
      //同步资产
      syncMoney(coin) {
        this.$api.showLoading();
        service.syncMoney({
          assetCode: coin,
          address: this.address
        }).then(({
          data
        }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            this.HMmessages.show('同步资产成功', {
              textAlign: 'center',
              background: '#356e36',
              fontColor: '#fff'
            });
          } else {
            this.errors(data.msg);
          }
        })
      },
      //获取体现地址
      getAddress() {
        this.$api.showLoading();
        service
        .getAddress({
          assetCode: this.coin
        })
        .then(({
          data
        }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            this.address = data.data[0].address;
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
      copy() {
        let that = this;
        uni.setClipboardData({
          data: that.address,
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
