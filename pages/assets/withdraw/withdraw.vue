<template>
  <view class="content">
    <view class="withdraw">
      <view class="withdraw_nav">
        <button :class="type == 'ordinary' ? 'active' : ''" @click="type = 'ordinary'">普通提币</button>
        <button :class="type == 'stand' ? 'active' : ''" @click="type = 'stand'">站内转币</button>
      </view>
      <view class="withdraw_form">
        <template v-if="type == 'ordinary'">
          <view class="item clear">
            <text class="fl">提币地址:</text>
            <view class="fr" @click="$goPage(`withdrawAddress/withdrawAddress?type=${coin}`)">
              <input style="float: left; width: 100%; height: 100%; width: calc(100% - 90upx);" v-model="form.address" type="text" disabled placeholder="请选择提币的地址" />
              <button style="width: 54upx; float: right;">选择</button>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="item clear">
            <text class="fl">对方ID:</text>
            <view class="fr"><input style="width: 100%; height: 100%;" v-model="form.uid" type="number" placeholder="请输入对方ID" /></view>
          </view>
        </template>
        <view class="item clear">
          <text class="fl">提币数量:</text>
          <view class="fr">
            <input v-model="form.number" :maxlength="maxNumberLnegth" style="float: left; width: calc(100% - 54upx); height: 100%;" type="digit" :placeholder="'可用:'+ asset" />
            <button style="width: 54upx;" @click="form.number = asset;">全部</button>
          </view>
        </view>
        <view class="item clear">
          <text class="fl">最低提币:</text>
          <view class="fr"><input style="width: 100%; height: 100%;" v-model="mini" disabled /></view>
        </view>
        <view class="item clear">
          <text class="fl">区块费用:</text>
          <view class="fr"><input style="width: 100%; height: 100%;" v-model="fee" disabled /></view>
        </view>
        <view class="item clear">
          <text class="fl">资金密码:</text>
          <view class="fr">
            <input v-model="form.pwd" style="float: left; width: calc(100% - 174upx); height: 100%;" type="password" placeholder="请输入资金密码" />
            <button style="width: 174upx;" @click="$goPage('../../account/securitySetting/securitySetting')">忘记资金密码？</button>
          </view>
        </view>
        <view class="item clear" v-if="GOOGLE.status == 'ON'">
          <text class="fl">谷歌验证:</text>
          <view class="fr"><input v-model="form.google" maxlength="6" style="width: 100%; height: 100%;" type="number" placeholder="请输入谷歌验证码" /></view>
        </view>
      </view>
      <view class="submits"><button @click="submits()">确认转出</button></view>
      <view class="withdraw_tpis">
        <view style="font-size: 24upx; color: #efd105;">禁止向{{coin}}地址充值除{{coin}}之外的资产，任何充入{{coin}}地址的非{{coin}}资产将不可找回</view>
        <view style="color: #fff; font-size: 24upx;">
          <text style="color: #efd105;">*</text>
          本站 {{coin}} 的钱包地址底层链为 {{COINCONFIG.asset[coin]}},转出区块时请确认收款地址也为该底层。
        </view>
        <view style="color: #fff; font-size: 24upx;">
          <text style="color: #efd105;">*</text>
          虚拟币转账在网络确认数达到3个确认后自动入账。
        </view>
      </view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from '../service.js';
import comSvc from '@/common/comSvc.js';
import { mapGetters } from 'vuex';
export default {
  components: {
    HMmessages
  },
  computed: {
    ...mapGetters(['GOOGLE','COINCONFIG'])
  },
  data() {
    return {
      type: 'ordinary',
      coin: '',
      asset:0,
      fee:0,
      mini:0,
      form:{
        address:'',
        uid:'',
        number:'',
        pwd:'',
        google:'',
      },
      maxNumberLnegth:-1,
    };
  },
  onLoad(option) {
    if (option && option.type) {
      uni.setNavigationBarTitle({
        title:option.type+'提币'
      })
      this.coin = option.type;
    }
  },
  onUnload() {
    this.$store.commit('setAddress','');
  },
  onShow() {
    this.form.address = this.$store.state.coinAddress;
    this.getAsset();
    this.getFee();
    this.getMini();
  },
  watch:{
    'form.number'(val){
      this.setMaxLength('form.number',val,'maxNumberLnegth');
    },
  },
  methods: {
    //设置小数点位数长度
    setMaxLength(name, val, maxName) {
      let precision = 4;
      let arrs = val.split('.');
      let attr0 = arrs[0];
      let attr1 = arrs[1];
      if (attr1) {
        this[name] = attr0 + '.' + attr1.slice(0, precision);
        this[maxName] = attr1.slice(0, precision).length == 4 ? this[name].length : -1;
      } else {
        this[maxName] = -1;
      }
    },
    //确定提现
    submits(){
      if(!this.veif()){
        return false;
      }
      let name = 'withdrawAddress'
      let params = {
        amount:this.form.number,
        assetCode:this.coin,
        fee:this.fee,
        message:'',
        outOrder:this.$api.outOrder()
      } 
      if(this.type != 'ordinary'){
        name = 'withdrawUser'
        params.depositUid = this.form.uid
      }else{
        params.address = this.form.address
      }
      this.$api.showLoading();
      service[name](params,{
        'pay-password':this.form.pwd,
        'service-code':'',
        'google-code':this.form.google
      }).then(({data})=>{
        this.$api.hideLoading();
        if(data.code == '100200'){
          this.form = {
            address:'',
            uid:'',
            number:'',
            pwd:'',
            google:''
          }
          this.getAsset();
          this.HMmessages.show('提币成功，可在该币种的记录查看', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        }else{
          this.errors(data.msg);
        }
      })
    },
    //获取提现手续费
    getFee(){
      service.getFee({
        key:'WITHDRAWMINFEE',
        assetCode:this.coin
      }).then(({data})=>{
        if(data.code == '100200'){
          this.fee = data.data.profileValue;
        }else{
          this.errors(data.msg)
        }
      })
    },
    //获取最小提现数额
    getMini(){
      service.getFee({
        key:'WITHDRAWMIN',
        assetCode:this.coin
      }).then(({data})=>{
        if(data.code == '100200'){
          this.mini = data.data.profileValue;
        }else{
          this.errors(data.msg)
        }
      })
    },
    //获取用户可用资产
    getAsset(){
      let that = this;
      this.$api.showLoading();
      comSvc.getAssets().then(({data})=>{
        this.$api.hideLoading();
        if(data.code == '100200'){
          data.data.map((e,i)=>{
            if(e.assetCode == that.coin){
              that.asset = e.amountAvailable;
            }
          })
        }else{
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
    //验证
    veif(){
      if(this.type == 'ordinary'){
        if(!this.form.address){
          this.errors('请输入提币地址');
          return false;
        }
      }else{
        if(!this.form.uid){
          this.errors('请输入对方ID');
          return false;
        }
      }
      if(!this.form.number && !Number(this.form.number)){
        this.errors('请输入正确的提币数量');
        return false;
      }
      if(!this.form.pwd){
        this.errors('请输入资金密码');
        return false;
      }
      if(this.GOOGLE.status == 'ON'){
        if(!this.form.google){
          this.errors('请输入谷歌验证码');
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
