<template>
  <view class="container">
    <!-- #ifdef APP-PLUS -->
    <view class="status_bar"><view class="top_view"></view></view>
    <!-- #endif -->
    <view class="c2cSuccess">
      <view class="info">
        <view class="title">
          <image src="/static/c2cSuc.png" style="width: 27upx; height: 36upx; margin-right: 5upx;" mode=""></image>
          <text>下单成功</text>
        </view>
        <view class="item clear">
          <text class="fl">付款剩余时间：</text>
          <view class="fr" v-if="Minute != 0">
            <uni-countdown
              :show-day="false"
              :backgroundColor="'transparent'"
              :borderColor="'transparent'"
              :splitor-color="'#f0c61e'"
              :color="'#f0c61e'"
              :minute="Minute"
              :second="Second"
              @timeup="orderTime()"
            ></uni-countdown>
          </view>
          <view class="fr" v-else style="color: #ec5151;">订单已超时</view>
        </view>
        <view class="item clear">
          <text class="fl">订&ensp;单&emsp;号&ensp;码：</text>
          <view class="fr">{{ form.transOrderId }}</view>
        </view>
        <view class="item clear">
          <text class="fl">付&ensp;款&emsp;方&ensp;式：</text>
          <view class="fr" v-if="form.dto.c2cPayType != 'BANK'">支付宝</view>
          <view class="fr" v-else>银行卡</view>
        </view>
        <view class="item clear">
          <text class="fl">对&ensp;方&emsp;昵&ensp;称：</text>
          <view class="fr">{{ form.sellNickname }}</view>
        </view>
        <view class="item clear" v-if="form.dto.bank">
          <text class="fl">银&nbsp;行&nbsp;卡&nbsp;账&nbsp;户：</text>
          <view class="fr">
            <view>{{ form.dto.bank }} / {{ form.dto.subBank }}</view>
            <view>
              {{ form.dto.acnumber }}
              <text style="color: #f0c61e; margin-left: 10upx;" @click="copy(form.dto.acnumber)">复制</text>
            </view>
          </view>
        </view>
        <view class="item clear" v-else>
          <text class="fl">支&nbsp;付&nbsp;宝&nbsp;账&nbsp;户：</text>
          <view class="fr">
            <view>
              {{ form.dto.name + ' / ' + form.dto.alipayNo }}
              <text style="color: #f0c61e; margin-left: 10upx;" @click="copy(form.dto.alipayNo)">复制</text>
            </view>
          </view>
        </view>
        <view class="item clear">
          <text class="fl">支&ensp;付&emsp;金&ensp;额：</text>
          <view class="fr">
            <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(form.money, 2) }}</text>
            {{ form.currency }}
          </view>
        </view>
        <view class="item clear">
          <text class="fl">付&nbsp;款&nbsp;参&nbsp;考&nbsp;号：</text>
          <view class="fr">{{ form.payCode }}</view>
        </view>
      </view>
      <view class="submits">
        <button v-if="Minute != 0" @click="goPage('')">前往订单完成支付</button>
        <template v-else>
          <button disabled style="opacity: 0.5;">前往订单完成支付</button>
          <button style="width: 200upx; padding: 0; margin-top: 33upx;" @click="goPage('index')">返回首页</button>
        </template>
      </view>
      <view class="tips">
        <text>确认完成打款并点击此按钮后。</text>
        <text>卖家确认收到款项后通知系统将币打入您的账户中，请注意查收。</text>
      </view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import uniCountdown from '@/components/uni-countdown/uni-countdown.vue';
import service from '../../service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import moment from '@/common/moment.js';
import filter from '@/common/filter.js';
export default {
  components: { uniCountdown, HMmessages },
  data() {
    return {
      filter,
      orderId: '',
      Time: '',
      Minute: 0,
      Second: 0,
      form: {
        dto: {}
      },
      type: ''
    };
  },
  onLoad(option) {
    if (option && option.orderId) {
      this.orderId = option.orderId;
      this.type = option.type;
    }
  },
  onShow() {
    this.c2cOrderInfo();
  },
  methods: {
    //前往订单还是返回首页
    goPage(type) {
      if (type == 'index') {
        uni.switchTab({
          url: '../../../index/index'
        });
      } else {
        if (this.type == 'BUY') {
          uni.redirectTo({
            url: '../../../c2c/c2cOrder/c2cOrder?type=BUY&orderType=SELL&user=ordinary'
          });
        } else {
          uni.redirectTo({
            url: '../../../c2c/c2cOrder/c2cOrder?type=SELL&orderType=PURCHASE&user=ordinary'
          });
        }
      }
    },
    //获取订单详情
    c2cOrderInfo() {
      this.$api.showLoading()
      service
        .c2cOrderInfo({
          transOrderId: this.orderId
        })
        .then(({ data }) => {
          this.$api.hideLoading()
          if (data.code == '100200') {
            this.form = data.data;
            this.Time = 1800000 - (parseInt(data.data.currentDate) - parseInt(data.data.createDate));
            if (this.Time <= 1000) {
              return false;
            }
            this.Minute = parseInt(
              moment(this.Time)
                .format('mm:ss')
                .split(':')[0]
            );
            this.Second = parseInt(
              moment(this.Time)
                .format('mm:ss')
                .split(':')[1]
            );
          } else {
            this.errors(data.msg);
          }
        });
    },
    //未付款订单超时
    orderTime() {
      this.Minute = 0;
      uni.showModal({
        content: '订单已超时',
        showCancel: false
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
