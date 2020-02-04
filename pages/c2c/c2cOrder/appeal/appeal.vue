<template>
  <view class="content">
    <view class="appeal">
      <view class="appeal_titll">
        <text>如果您的权益受到损害，请在此处填写申诉单，客服会在 1~2 个工作日处理。</text>
        <text>您也可以直接发送邮件咨询客服 lkex123@gmail.com</text>
      </view>
      <view class="appeal_main">
        <view class="item clear">
          <text class="fl">申述订单号：</text>
          <view class="fr"><input type="text" v-model="transOrderId" disabled placeholder="请输入订单号" /></view>
        </view>
        <view class="item clear">
          <text class="fl">申述原因：</text>
          <view class="fr">
            <picker @change="setReason" :value="reason" :range="reasonList">
              <view class="uni-input">{{ reasonList[reason] }}</view>
            </picker>
            <view class="downs"><uni-icon type="arrowdown" size="22" :color="'#03bcc0'"></uni-icon></view>
          </view>
        </view>
        <view class="item clear">
          <text class="fl">联系方式：</text>
          <view class="fr"><input type="number" v-model="phone" placeholder="请输入手机号" /></view>
        </view>
        <view class="item clear">
          <text class="fl">付款方式：</text>
          <view class="fr">
            <picker @change="setPayType" :value="payType" :range="payTypeList">
              <view class="uni-input">{{ payTypeList[payType] }}</view>
            </picker>
            <view class="downs"><uni-icon type="arrowdown" size="22" :color="'#03bcc0'"></uni-icon></view>
          </view>
        </view>
        <view class="item clear">
          <text class="fl">交易流水号：</text>
          <view class="fr"><input type="number" v-model="orderId" placeholder="请输入交易流水号" /></view>
        </view>
        <view class="item clear item_upload">
          <text class="fl">付款截图：</text>
          <view class="fr">
            <template v-if="!imgPtoUrl">
              <image src="/static/c2c/certificate.jpg" mode="widthFix"></image>
            </template>
            <template v-else>
              <image :src="imgPtoUrl" mode="widthFix"></image>
            </template>
            <view class="btn_upload"><button @click="upload('imgPtoUrl', 'imgPto')">点击上传</button></view>
          </view>
        </view>
        <view class="item clear item_remarks">
          <text class="fl">备注信息：</text>
          <view class="fr"><textarea placeholder="请输入备注信息" v-model="remarks" /></view>
        </view>
      </view>
      <view class="submits"><button @click="submits()">提交申述</button></view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import {REG_PHONE} from '@/common/reg.js';
import service from '../../service.js';
export default {
  components: {
    uniIcon,
    HMmessages
  },
  data() {
    return {
      transOrderId: '',
      reason: 0,
      phone: '',
      reasonList: ['我已打款给卖家，卖家未打币', '我未收到买家的付款', '买家付款金额不符', '卖家打币数量不符', '其他原因（备注说明）'],
      payType: 0,
      payTypeList: ['支付宝', '银行卡'],
      imgPto: '',
      imgPtoUrl: '',
      orderId: '',
      remarks: '',
      orderType: '',
      userType: ''
    };
  },
  onLoad(option) {
    if (option && option.transOrderId) {
      this.transOrderId = option.transOrderId;
      this.orderType = option.type;
      this.userType = option.behalf;
    }
  },
  onShow() {
    if (this.$api.isLogin()) {
      return false;
    }
    this.$api.goLogin('../../../login/login');
  },
  methods: {
    //提交
    submits() {
      let that = this;
      if(!this.veif()){
        return false;
      }
      let name = this.orderType == 'PURCHASE' ? 'orderComplaintBuy' : 'orderComplaintSell';
      let param = {
        transOrderId: this.transOrderId,
        complainReason: this.reasonList[this.reason],
        phone: this.phone,
        payType: this.payTypeList[this.payType] == '支付宝' ? 'ALIPAY' : 'BANK',
        payNo: this.orderId,
        capture: [this.imgPto],
        remark: this.remarks
      };
      this.$api.showLoading();
      service[name](param).then(({data}) => {
        this.$api.hideLoading();
        if (data.code == '100200') {
          this.HMmessages.show('申诉成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff',
            callback: () => {
              that.back();
            }
          });
        } else {
          this.errors(data.msg);
        }
      })
    },
    //上传图片
    upload(name, imgName) {
      let that = this;
      uni.chooseImage({
        count: 1, //默认9
        success: function(res) {
          if (res.tempFiles[0].size * 1 > 2097152) {
            that.errors('图片大小超过2MB，请重新选择');
            return false;
          }
          uni.showLoading({
            title: '上传中...',
            mask: true
          });
          uni.uploadFile({
            url: that.$api.baseUrl + '/exchangeApi/common/upload-photo/private',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              'Content-Type': 'image/jpeg;'
            },
            header: {
              authorization: 'token=' + uni.getStorageSync('TOKEN'),
              'accept-language': 'zh-CN'
            },
            success: data => {
              uni.hideLoading();
              let resData = JSON.parse(data.data);
              if (resData.code == '100200') {
                that[name] = res.tempFilePaths[0];
                that[imgName] = resData.data.name;
              } else {
                that.errors(resData.msg);
              }
            },
            fail: err => {
              uni.hideLoading();
              uni.showToast({
                icon: 'none',
                title: '网络异常，请稍后重试',
                position: 'bottom'
              });
            }
          });
        }
      });
    },
    //设置支付类型
    setPayType(e) {
      this.payType = e.target.value;
    },
    //设置原因
    setReason(e) {
      this.reason = e.target.value;
    },
    //验证
    veif() {
      if (!REG_PHONE.test(this.phone)) {
        this.errors('请输入正确的手机号码');
        return false;
      }
      if (!this.orderId) {
        this.errors('请输入交易流水号');
        return false;
      }
      if (!this.imgPto) {
        this.errors('请上传付款截图');
        return false;
      }
      if (!this.remarks) {
        this.errors('请输入备注信息');
        return false;
      }
      return true;
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
          url: '../../c2c'
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
