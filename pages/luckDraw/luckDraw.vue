<template>
  <view class="content luckDraw">
    <template v-if="showList == false">
      <view class="luckDraw_top">
        <image @click="showRed = true" src="/static/openRed.png" style="width: 395rpx; height: 389rpx; margin: 0 auto; display: block;" mode=""></image>
      </view>
      <view class="open_red"></view>
    </template>
    <template v-else>
      <view class="luckDraw_top">
        <template v-if="money == 0">
          <view class="title">{{ REG_EMAIL.test(launchUser.account) ? filter.email(launchUser.account) : filter.getSuffixPhone(launchUser.account) }} 发出的红包</view>
          <view class="money">共 {{ launchUser.assetAmount }} {{ launchUser.assetCode }}</view>
        </template>
        <template v-if="money > 0">
          <view class="money">恭喜获得红包!</view>
          <!-- <view class="title">{{name}}</view> -->
          <view class="money">{{ money }} {{ launchUser.assetCode }}</view>
        </template>
      </view>
      <view class="open_red"><button v-if="launchUser.assetAmountRemain == 0" style="opacity: 0.8;">该红包已领完</button></view>
    </template>
    <template v-if="showList">
      <view class="bg_bg"></view>
      <view class="list_title">
        <text v-if="showMyMoney">已领{{ filter.fix(launchUser.assetAmount * 1 - launchUser.assetAmountRemain * 1, 4) }} {{ launchUser.assetCode }}，剩余{{ launchUser.assetAmountRemain }} {{ launchUser.assetCode }}，</text>
        领取 {{ launchUser.paperNum - launchUser.paperNumRemain }} / {{ launchUser.paperNum }}
      </view>
      <view class="list_mian">
        <view class="item" v-for="(item, index) in receiveList" :key="index">
          <view class="clear">
            <view class="fl">{{ REG_EMAIL.test(item.account) ? filter.email(item.account) : filter.getSuffixPhone(item.account) }}</view>
            <view class="fr" style="color: #d14b64;">{{ item.gainAsset }} {{ launchUser.assetCode }}</view>
          </view>
          <view class="clear">
            <view class="fl" style="color: #a3a3a3;">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm:ss') }}</view>
          </view>
        </view>
      </view>
    </template>

    <!-- 领取红包 -->
    <Modal :title="'红包领取'" mClass="luckDraw_modal" :isMask="true" v-if="showRed" @close="closeModal('showRed')">
      <view class="common_model luckDraw_modal_mian">
        <view class="common_form">
          <view class="item clear">
            <view class="fr" style="width: 100%;"><input type="text" v-model="name" placeholder="请输入领取账户" /></view>
          </view>
        </view>
        <view class="common_btn">
          <button @click="closeModal('showRed')">取消</button>
          <button class="active" @click="gain()">确定</button>
        </view>
        <view class="common_foot_tip" style="color: #fde1b1;">
          未注册？
          <text style="color: #17233d; text-decoration: underline;" @click="$goPage('/pages/register/register?code=' + invtCode)">点击前往注册</text>
        </view>
      </view>
    </Modal>

    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import service from './service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import Modal from '@/components/lkex-modal/index.vue';
import { REG_EMAIL,REG_CH_PHONE } from '@/common/reg.js';
import filter from '@/common/filter.js';
export default {
  components: {
    HMmessages,
    Modal
  },
  data() {
    return {
      REG_EMAIL,
      filter,
      receiveList: [],
      invtCode: '',
      launchUser: {},
      showRed: false,
      name: '',
      redCode: '',
      showList:false,
      showMyMoney:false,
      money:0,
    };
  },
  onLoad(option) {
    if (option && option.redCode) {
      this.redCode = option.redCode;
      this.invtCode = option.invtCode;
    } else {
      uni.showModal({
        title: '提示',
        content: '红包不存在',
        showCancel: false,
        success: () => {
          uni.navigateBack({
            delta: 1
          });
        }
      });
    }
  },
  onShow() {
    this.name = uni.getStorageSync('account') ? uni.getStorageSync('account') : '';
    if (this.redCode) {
      this.getAllrecord(this.redCode);
    }
  },
  methods: {
    //领取红包
    gain() {
      if (!this.name) {
        this.errors('请输入领取账户');
        return false;
      }
      this.$api.showLoading();
	  
      service
        .gain({
          account: REG_EMAIL.test(this.name) ? this.name : '86' + this.name,
          paperCode: this.launchUser.paperCode,
          type: REG_EMAIL.test(this.name) ? 'EMAIL' : 'MOBILE'
        })
        .then(({ data }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            this.showRed = false;
            this.showList = true;
            this.money = data.data;
            this.showMyMoney = true;
            this.closeModal('showRed');
            this.getAllrecord(this.redCode);
          } else {
            if (data.code == '104102') {
              this.errors('账户未注册');
            } else if(data.code == '104163') {
              this.showRed = false;
              this.showList = true;
              this.showMyMoney = true;
              this.errors(data.msg);
            }else{
              this.errors(data.msg);
            }
          }
        });
    },
    //关闭弹窗
    closeModal(name) {
      this[name] = false;
    },
    //查询领取记录
    getAllrecord(id) {
      this.$api.showLoading();
      service
        .getAllrecord({
          paperId: id
        })
        .then(({ data }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            this.invtCode = data.data.inviteCode;
            this.launchUser = data.data.redPaper;
            this.receiveList = data.data.redPaperGains;
            if(this.launchUser.assetAmountRemain == 0){
              this.showRed = false;
              this.showList = true;
              this.showMyMoney = true;
            }
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
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
