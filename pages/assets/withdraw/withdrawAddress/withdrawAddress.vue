<template>
  <view class="content withdrawAddress">
    <view class="withdrawAddress_list">
      <view class="item" v-for="(item,index) in list" :key="index" @click="selectAddress(item)">
        <text style="font-size: 28rpx;">{{item.memo}}</text>
        <text style="font-size: 24rpx; color: #03bcc0;">{{item.address}}</text>
        <view class="del" @click.stop="del(item)">
          <uni-icons type="clear" size="28" color="#fff"></uni-icons>
        </view>
      </view>
    </view>
    <view class="withdrawAddress_add">
      <button @click="addAddress(false)">添加地址</button>
    </view>

    <!-- 添加地址 -->
    <Modal :title="'添加地址'" :isMask="true" v-if="isAddress" @close="closeModal('isAddress')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">名称:</text>
            <view class="fr"><input type="text" v-model="name" placeholder="请输入地址名称" /></view>
          </view>
          <!-- #ifdef H5 -->
          <view class="item clear">
            <text class="fl">地址:</text>
            <view class="fr">
              <input type="text" v-model="address" placeholder="请输入地址(请认真核对)" />
            </view>
          </view>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <view class="item imgCode clear">
            <text class="fl">地址:</text>
            <view class="fr">
              <view class="code"><button plain @click="scan">扫描</button></view>
              <input type="text" v-model="address" placeholder="请输入地址(请认真核对)" />
            </view>
          </view>
          <!-- #endif -->
        </view>
        <view class="common_btn">
          <button @click="closeModal('isAddress')">取消</button>
          <button class="active" @click="addAddress(true)">确定</button>
        </view>
      </view>
    </Modal>

    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
  import {
    uniIcon
  } from '@dcloudio/uni-ui';
  import service from '../../service.js';
  import HMmessages from '@/components/HM-messages/HM-messages.vue';
  import Modal from '@/components/lkex-modal/index.vue';
  export default {
    components: {
      uniIcon,
      HMmessages,
      Modal
    },
    data() {
      return {
        isAddress: false,
        list: [],
        coin: 'ALL',
        name: '',
        address: '',
      };
    },
    onLoad(option) {
      if (option && option.type) {
        this.coin = option.type;
      }
    },
    onShow() {
      this.getList();
    },
    methods: {
      //扫描二维码
      scan() {
        let that = this;
        uni.scanCode({
          success: function(res) {
            // console.log('条码类型：' + res.scanType);
            that.address = res.result;
            // console.log('条码内容：' + res.result);
          }
        });
      },
      //选择地址
      selectAddress(item) {
        this.$store.commit('setAddress', item.address);
        uni.navigateBack({
          delta: 1
        })
      },
      //添加地址
      addAddress(bool) {
        if (this.list.length >= 5) {
          this.errors('地址最多添加五个，请删除部分地址重试');
          return false;
        }
        if (!bool) {
          this.isAddress = true;
          return false;
        }
        if (!this.name) {
          this.errors('请输入地址名称');
          return false;
        }
        if (!this.address) {
          this.errors('请输入地址');
          return false;
        }
        this.$api.showLoading();
        service.addAddress({
          address: this.address,
          assetCode: this.coin,
          memo: this.name
        }).then(({
          data
        }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            this.closeModal('isAddress');
            this.getList();
            this.HMmessages.show('添加地址成功', {
              textAlign: 'center',
              background: '#356e36',
              fontColor: '#fff',
            });
          } else {
            this.errors(data.msg);
          }
        })
      },
      //获取地址列表
      getList() {
        service.addressList({
          assetCode: this.coin,
          pageNo: 1,
          pageSize: 5
        }).then(({
          data
        }) => {
          if (data.code == '100200') {
            this.list = data.data.list;
          } else {
            this.errors(data.msg)
          }
        })
      },
      //删除地址
      del(item) {
        let that = this;
        uni.showModal({
          title: '删除地址',
          content: '删除地址后无法恢复，是否操作？',
          success(res) {
            if (res.confirm) {
              that.$api.showLoading();
              service.delAddress({
                id: item.addressid
              }).then(({
                data
              }) => {
                that.$api.hideLoading();
                if (data.code == '100200') {
                  that.getList();
                  that.HMmessages.show('删除地址成功', {
                    textAlign: 'center',
                    background: '#356e36',
                    fontColor: '#fff',
                  });
                } else {
                  that.errors(data.msg)
                }
              })
            }
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
      //隐藏弹窗
      closeModal(name) {
        this[name] = !this[name];
        this.name = '';
        this.address = '';
      }
    }
  }
</script>

<style lang="scss">
  @import './style.scss';
</style>
