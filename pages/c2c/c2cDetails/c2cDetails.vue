<template>
  <view class="content">
    <view class="c2cDetails">
      <view class="header">
        <view class="item clear">
          <view class="fl">
            价格：
            <text style="margin-right: 8upx;">{{ filter.floorFix(form.tradePrice, 2) }}</text>
            {{ form.currency }} / {{ assetcode }}
          </view>
          <view class="fr">
            付款期限：
            <text style="margin-right: 8upx;">30</text>
            分钟
          </view>
        </view>
        <view class="item clear">
          <view class="fl">
            限额：
            <template v-if="type == 'BUY'">
              {{ filter.floorFix(form.minAmount > form.maxAmount - form.hadSellNum ? form.maxAmount - form.hadSellNum : form.minAmount, 2) }} ~
              {{ filter.floorFix(form.maxAmount - form.hadSellNum, 2) }} {{ assetcode }}
            </template>
            <template v-else>
              {{ filter.floorFix(form.purchaseMin > form.purchaseMax - form.hadPurchaseNum ? form.purchaseMax - form.hadPurchaseNum : form.purchaseMin, 2) }} ~
              {{ filter.floorFix(form.purchaseMax - form.hadPurchaseNum, 2) }} {{ assetcode }}
            </template>
          </view>
          <view class="fr">所在国家：{{ form.country }}</view>
        </view>
        <view class="item clear">
          <view class="fl">卖家：{{ type == 'BUY' ? form.nickName : form.nickname }}</view>
        </view>
        <view class="item clear">
          <view class="fl">备注：{{ form.remark || '无' }}</view>
        </view>
      </view>
      <view class="fee clear">
        <text class="fl">手续费：{{form.fee}}</text>
        <text class="fr" v-if="type == 'SELL'">账户余额：{{filter.fix(balance,6) +' '+ assetcode}}</text>
      </view>
      <view class="number_money">
        <view class="item clear">
          <text class="fl">{{ type == 'BUY' ? '购买数量' : '出售数量' }}：</text>
          <view class="fr">
            <input class="input" v-model="number" type="digit" placeholder="请输入购买数量" />
            <text class="coin">{{ assetcode }}</text>
          </view>
        </view>
        <view class="item clear">
          <text class="fl">{{ type == 'BUY' ? '支付金额' : '收款金额' }}：</text>
          <view class="fr">
            <input class="input" v-model="price" type="text" disabled placeholder="输入购买数量后自动计算" />
            <text class="coin">{{ form.currency }}</text>
          </view>
        </view>
        <view class="item clear payType">
          <text class="fl">{{ type == 'BUY' ? '支付方式' : '收款方式' }}：</text>
          <view class="fr">
            <template v-if="type == 'BUY'">
              <block v-for="(item, index) in form.payType" :key="index">
                <view class="flex" :class="payType == item ? 'active' : ''" @click="setPayType(item)">
                  <view class="checkbox"><uni-icons v-if="payType == item" type="checkmarkempty" size="22" color="#fff"></uni-icons></view>
                  <text>{{ item == 'BANK' ? '银行卡' : '支付宝' }}</text>
                </view>
              </block>
            </template>
            <template v-else>
              <view class="flex" v-if="ALIPAY.noPay" :class="payType == 'ALIPAY' ? 'active' : ''" @click="setPayType('ALIPAY')">
                <view class="checkbox"><uni-icons v-if="payType == 'ALIPAY'" type="checkmarkempty" size="22" color="#fff"></uni-icons></view>
                <text>支付宝</text>
              </view>
              <view class="flex" v-if="BANK.noPay" :class="payType == 'BANK' ? 'active' : ''" @click="setPayType('BANK')">
                <view class="checkbox"><uni-icons v-if="payType == 'BANK'" type="checkmarkempty" size="22" color="#fff"></uni-icons></view>
                <text>银行卡</text>
              </view>
              <view class="flex" v-if="!BANK.noPay && !ALIPAY.noPay" style="color: #f0c61e; text-decoration: underline;" @click="$goPage('../../account/securitySetting/securitySetting')">前往设置收付方式</view>
            </template>
          </view>
        </view>
      </view>
      <view class="Remarks"><textarea v-model="remark" placeholder="备注:告诉卖家您的要求" /></view>
      <view class="submits">
        <button v-if="loading == false" @click="submits()">{{ type == 'BUY' ? '确认购买' : '确认出售' }}</button>
        <button v-else disabled :loading="true" style="opacity: 0.5;">{{ type == 'BUY' ? '确认购买' : '确认出售' }}</button>
      </view>
      <view class="tips">
        <view style="color: #f0c61e; line-height: 60upx;">*购买须知</view>
        <text>卖家的数字货币已被锁定在托管中，受到lkex保护，请您放心购买。</text>
        <text>建议您发起购买交易请求后，应在指定时间内付款并把交易标记为付款已完成，卖家在收到付款后将会放行处于托管中的数字货币。</text>
        <text>为了保障资金账户安全及争议，请一定要通过您在lkex平台实名认证的账号进行付款，如果使用其他账户进行付款并发生争议，平台方将有权利不做处理。</text>
        <text>当心骗子！交易前请检查该用户收到的评价，并对新近创建的账户多加留意。</text>
        <text>请注意， 四舍五入和价格的波动可能会影响最终成交的数字货币数额。 您输入的固定数额决定最后数额， 数字货币金额将在请求发布的同一时间由即时的汇率算出。</text>
        <text>托管服务保护网上交易的买卖双方。在发生争议的情况下，我们将评价所提供的所有信息，并将托管的数字货币放行给其合法所有者。</text>
      </view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
import service from '../service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import filter from '@/common/filter.js';
import comSvc from '@/common/comSvc.js';
import { mapGetters } from 'vuex';
export default {
  components: { uniIcon, HMmessages },
  computed: {
    ...mapGetters(['USERINFO'])
  },
  data() {
    return {
      filter,
      form: {},
      assetcode: '',
      type: 'BUY',
      payType: '',
      number: '',
      price: '',
      balance: '',
      ALIPAY: {
        alipayNo: '',
        name: '',
        noPay: true
      },
      BANK: {
        acnumber: '',
        bank: '',
        name: '',
        subBank: '',
        noPay: true
      },
      c2cInfo: {},
      advertId: '',
      remark: '',
      loading: false
    };
  },
  onLoad(option) {
    if (option && option.advertId) {
      this.advertId = option.advertId;
      this.type = option.type;
    }
  },
  onShow() {
    let that = this;
    if (this.$api.isLogin()) {
      setTimeout(() => {
        if (this.USERINFO.authLevel == 'LEVEL0') {
          uni.showModal({
            title: '提示',
            content: '请进行实名认证后进行购买',
            confirmText: '前往实名',
            success(res) {
              if (res.confirm) {
                that.$goPage('../../authentication/authentication');
              }
            }
          });
          return false;
        }
        if (!this.USERINFO.setPayPassword) {
          uni.showModal({
            title: '提示',
            content: '请先设置资金密码在进行交易',
            confirmText: '前往设置',
            success(res) {
              if (res.confirm) {
                that.$goPage('../../account/securitySetting/securitySetting');
              }
            }
          });
          return false;
        }
      }, 1000);
      this.advertDetail();
      this.getC2cPayInfo();
      this.getAsset();
      return false;
    }
    this.$api.goLogin('../../login/login');
  },
  watch: {
    number(val) {
      this.price = filter.floorFix((val ? val : 0) * this.form.tradePrice, 2);
    }
  },
  methods: {
    //获取用户资产
    getAsset() {
      comSvc.getAssets().then(({
        data
      }) => {
        if (data.code == '100200') {
          this.asset = data.data;
          this.asset.map((e, i) => {
            if (e.assetCode == this.assetcode) {
              this.balance = e.amountAvailable;
            }
          });
        } else {
          this.errors(data.msg);
        }
      });
    },
    //购买或者出售提交
    submits() {
      let that = this;
      if (!this.veif()) {
        return false;
      }
      let name = this.type == 'BUY' ? 'createAdOrder' : 'createSellOrder';
      let param = {
        advertId: this.advertId,
        money: this.price,
        number: this.number,
        payType: this.payType,
        remark: this.remark
      };
      this.loading = true;
      service[name](param).then(({ data }) => {
        that.loading = false;
        if (data.code == '100200') {
          that.HMmessages.show('下单成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff',
            callback: () => {
              if (that.type == 'BUY') {
                uni.redirectTo({
                  url: '../c2cOrder/c2cOrder?type=BUY&orderType=SELL&user=ordinary'
                });
              } else {
                uni.redirectTo({
                  url: '../c2cOrder/c2cOrder?type=SELL&orderType=PURCHASE&user=ordinary'
                });
              }
            }
          });
        } else {
          that.loading = false;
          this.errors(data.msg);
        }
      });
    },
    //查询C2C支付绑定
    getC2cPayInfo() {
      service.getC2cPayInfo().then(({ data }) => {
        if (data.code == '100200') {
          for (let i of data.data) {
            this.c2cInfo[i.c2cPayType] = i;
          }
          this.ALIPAY.noPay = this.c2cInfo.ALIPAY.alipayNo ? true : false;
          this.BANK.noPay = this.c2cInfo.BANK.acnumber ? true : false;
        } else {
          this.errors(data.msg);
        }
      });
    },
    //设置支付类型
    setPayType(name) {
      this.payType = name;
    },
    //查询广告信息
    advertDetail() {
      let name = this.type == 'BUY' ? 'sellDetailQuery' : 'buyDetailQuery';
      service[name]({
        advertId: this.advertId
      }).then(({ data }) => {
        if (data.code == '100200') {
          this.form = data.data;
          this.assetcode = this.type == 'BUY' ? this.form.assetcode : this.form.assetCode;
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
    //验证
    veif() {
      
      let that = this;
      if (this.USERINFO.authLevel == 'LEVEL0') {
        uni.showModal({
          title: '提示',
          content: '请进行实名认证后进行购买',
          confirmText: '前往实名',
          success(res) {
            if (res.confirm) {
              that.$goPage('../../authentication/authentication');
            }
          }
        });
        return false;
      }
      if (!this.USERINFO.setPayPassword) {
        uni.showModal({
          title: '提示',
          content: '请先设置资金密码在进行交易',
          confirmText: '前往设置',
          success(res) {
            if (res.confirm) {
              that.$goPage('../../account/securitySetting/securitySetting');
            }
          }
        });
        return false;
      }
      if (!this.USERINFO.nickname) {
        uni.showModal({
          title: '提示',
          content: '请先设置交易昵称',
          confirmText: '设置',
          success(res) {
            if (res.confirm) {
              that.$goPage('../../account/account');
            }
          }
        });
        return false;
      }
      if (!this.ALIPAY.noPay || !this.BANK.noPay) {
        uni.showModal({
          title: '提示',
          content: '请进绑定银行卡和支付宝进行操作',
          confirmText: '绑定',
          success(res) {
            if (res.confirm) {
              that.$goPage('../../account/securitySetting/securitySetting');
            }
          }
        });
        return false;
      }
      let val = this.number;
      if (!val) {
        this.errors('请输入数量');
        return false;
      }
      if (this.type == 'SELL') {
        if (Number(val + '') * 1 < (this.form.purchaseMin > this.form.purchaseMax - this.form.hadPurchaseNum ? this.form.purchaseMax - this.form.hadPurchaseNum : this.form.purchaseMin)) {
          this.errors('不能低于下限');
          return false;
        } else if (Number(val + '') * 1 > this.form.purchaseMax - this.form.hadPurchaseNum) {
          this.errors('不能高于上限');
          return false;
        } else if (Number(val + '') * 1 + Number(val + '') * this.form.fee > this.balance) {
          this.errors('资产余额不足');
          return false;
        }
      } else {
        if (Number(val + '') * 1 < (this.form.minAmount > this.form.maxAmount - this.form.hadSellNum ? this.form.maxAmount - this.form.hadSellNum : this.form.minAmount)) {
          this.errors('不能低于下限');
          return false;
        } else if (Number(val + '') > this.form.maxAmount - this.form.hadSellNum) {
          this.errors('不能高于上限');
          return false;
        }
      }
      if (!this.payType) {
        this.errors('请选择交易方式');
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
