<template>
  <view class="content">
    <view class="c2cAgent">
      <view class="c2cAgent_isVip">
        <text class="iconfont" style="color: #03bcbf;">&#xe73b;</text>
        <view class="text">
          售卖区：可发布广告为
          <text>{{ VIP1.sellAdLimitNum }}</text>
          个，单笔上限交易为
          <text>{{ VIP1.sellAdLimitCoinNum }}</text>
        </view>
        <view class="text">
          收购区：可发布广告为
          <text>{{ VIP1.buyAdLimitNum }}</text>
          个，单笔上限交易为
          <text>{{ VIP1.buyAdLimitCoinNum }}</text>
        </view>
      </view>
      <template v-if="user.applyFlag == 'INIT'">
        <view class="c2cAgent_Apply">
          <view class="tpis">
            <view class="text">升级需向以下钱包地址转入对应的保证金(USDK)，请务必在转币时备注：</view>
            <view class="text">
              <text>账户ID</text>
              +
              <text>邮箱/手机号</text>
            </view>
            <view class="text">
              如
              <text>张三，123456789@qq.com/138000138000</text>
            </view>
          </view>
        </view>
        <view class="c2cAgent_Apply_main">
          <view class="item clear">
            <text class="fl">申请等级：</text>
            <view class="fr"><input type="text" disabled value="V1" /></view>
          </view>
          <view class="item clear">
            <text class="fl">保&ensp;证&ensp;金：</text>
            <view class="fr"><input type="text" v-model="VIP1.assureAsset" disabled /></view>
          </view>
          <view class="item clear">
            <text class="fl">收款地址：</text>
            <view class="fr">
              <view class="copy">
                <input type="text" v-model="address" disabled />
                <button @click="copy(address)">复制</button>
              </view>
            </view>
          </view>
          <view class="item clear">
            <text class="fl">打款地址：</text>
            <view class="fr"><input type="text" v-model="coinAddress" placeholder="请输入打款地址" /></view>
          </view>
          <view class="item clear">
            <text class="fl">打款数量：</text>
            <view class="fr"><input type="text" v-model="coinNumber" placeholder="请输入打款数量" /></view>
          </view>
          <view class="item clear">
            <text class="fl">手&ensp;机&ensp;号：</text>
            <view class="fr"><input type="text" v-model="phone" placeholder="请输入手机号" /></view>
          </view>
          <view class="item clear">
            <text class="fl">备注信息：</text>
            <view class="fr" style="line-height: 1.8; height: 92upx;"><textarea style="font-size: 26upx;; padding: 10upx 20upx;" v-model="remarks" placeholder="请输入备注信息" /></view>
          </view>
          <view class="submits"><button @click="submits()">确认申请</button></view>
        </view>
      </template>
      <template v-if="user.applyFlag == 'INITING'">
        <view class="c2cAgent_Apply">
          <view class="tpis">申请审核中</view>
        </view>
      </template>
      <template v-if="user.applyFlag.indexOf('VIP') > -1">
        <view class="c2cAgent_Apply">
          <view class="tpis">您已经是承兑商</view>
        </view>
      </template>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import service from '../service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import { REG_PHONE } from '@/common/reg.js';
export default {
  components: {
    HMmessages
  },
  data() {
    return {
      VIP1: '',
      VIP2: '',
      VIP3: '',
      user: {
        applyFlag:''
      },
      privilege: {},
      address: '0x1501B67ED97A887bCc66D8cAc6d6474865C93C28',
      coinAddress: '',
      coinNumber: '',
      phone: '',
      remarks: ''
    };
  },
  onShow() {
    if (this.$api.isLogin()) {
      this.memberConfigInfo();
      return false;
    }
    this.$api.goLogin('../../login/login');
  },
  methods: {
    //确定申请
    submits() {
      if (!this.veif()) {
        return false;
      }
      let params = {
        coinAddress: this.coinAddress,
        phone: this.phone,
        remark: this.remarks,
        applyLevel: 'VIP1',
        coinNum: this.coinNumber
      };
      let that = this;
      service.userApplyMember(params).then(({ data }) => {
        if (data.code == '100200') {
          that.HMmessages.show('申请成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff',
            callback: () => {
              that.memberConfigInfo();
            }
          });
        } else {
          this.errors(data.msg);
        }
      });
    },
    veif() {
      if (!this.coinAddress) {
        this.errors('请输入打款地址');
        return false;
      }
      if (!this.coinNumber) {
        this.errors('请输入打款数量');
        return false;
      }
      if (!REG_PHONE.test(this.phone)) {
        this.errors('请输入正确的手机号码');
        return false;
      }
      if (!this.remarks) {
        this.errors('请输入备注信息');
        return false;
      }
      return true;
    },
    //查询会员详情
    memberConfigInfo() {
      this.$api.showLoading();
      service.memberConfigInfo().then(({ data }) => {
        this.$api.hideLoading();
        if (data.code == '100200') {
          for (let i of data.data) {
            if (i.applyFlag == 'null' || !i.applyFlag) {
              this[i.member] = i;
            } else {
              this.user = i;
              this.privilege = this[this.user.applyFlag];
            }
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
