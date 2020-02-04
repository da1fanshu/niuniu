<template>
  <view class="content">
    <!-- #ifdef APP-PLUS -->
    <view class="status_bar"><view class="top_view"></view></view>
    <!-- #endif -->
    <view class="account_mian">
      <view class="account_mian_header">
        <view class="m_h_top">
          <image src="/static/userHeader.png" style="width: 77upx; height: 77upx;" mode=""></image>
          <view class="m_h_account">
            <view class="clear">
              <view class="fl">{{ formText(USERINFO.nickname, 'nickname') }}</view>
              <view class="fr" v-if="!USERINFO.nickname" @click="isSetName = true">昵称设置</view>
            </view>
            <text style="font-size: 27upx;">{{ formatUser(USERINFO.account) }}</text>
            <text>UID：{{ filter.getFormattedUid(USERINFO.uid) }}</text>
          </view>
        </view>
        <view class="m_h_nav">
          <view class="flex" @click="$goPage('securitySetting/securitySetting')">
            <image src="/static/set.png" style="width: 28upx; height: 35upx;" mode=""></image>
            <text>安全设置</text>
          </view>
          <template v-if="USERINFO.authLevel == 'LEVEL0'">
            <view class="flex" @click="$goPage('../authentication/authentication')">
              <image src="/static/id.png" style="width: 49upx; height: 35upx;" mode=""></image>
              <text>实名认证</text>
            </view>
          </template>
          <template v-else>
            <view class="flex">
              <image src="/static/id.png" style="width: 49upx; height: 35upx;" mode=""></image>
              <text>{{ formText(USERINFO.authLevel, 'real') }}</text>
            </view>
          </template>
        </view>
      </view>
      <view class="account_main_list">
        <view class="account_main_list_item clear" @click="$goPage('message/message')">
          <view class="fl">
            <image src="/static/messages.png" mode=""></image>
            <text>消息提醒</text>
          </view>
          <view class="fr">
            <!-- <text class="messages">99+</text> -->
            <uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon>
          </view>
        </view>
      </view>
      <!-- <view class="account_main_list">
        <view class="account_main_list_item clear" @click="$goPage('community/community')">
          <view class="fl">
            <image src="/static/shequn.png" mode=""></image>
            <text>社群群组</text>
          </view>
          <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
        </view>
      </view> -->
      
      <view class="account_main_list">
        <view class="account_main_list_item clear" @click="$goPage('invitation/invitation')">
          <view class="fl">
            <image src="/static/myCode.png" mode=""></image>
            <text>我的邀请</text>
          </view>
          <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
        </view>
      </view>
      
      <view class="account_main_list">
        <view class="account_main_list_item clear" @click="$goPage('bonus/bonus')">
          <view class="fl">
            <image src="/static/redbao.png" mode=""></image>
            <text>红包</text>
          </view>
          <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
        </view>
      </view>
      
	  <view class="account_main_list">
	    <view class="account_main_list_item clear" @click="$goPage('thaw/thaw')">
	      <view class="fl">
	        <image src="/static/shequn.png" mode=""></image>
	        <text>解冻记录</text>
	      </view>
	      <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
	    </view>
	  </view>
	  
      <template v-if="false">
        <view class="account_main_list">
          <view class="account_main_list_item clear">
            <view class="fl">
              <image src="/static/myRow.png" mode=""></image>
              <text>我的邀请</text>
            </view>
            <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
          </view>
          <view class="account_main_list_item clear">
            <view class="fl">
              <image src="/static/myMoney.png" mode=""></image>
              <text>我的分红</text>
            </view>
            <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
          </view>
        </view>
        <view class="account_main_list">
          <view class="account_main_list_item clear">
            <view class="fl">
              <image src="/static/zhongcheng.png" mode=""></image>
              <text>忠诚计划</text>
            </view>
            <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
          </view>
          <view class="account_main_list_item clear">
            <view class="fl">
              <image src="/static/gonggying.png" mode=""></image>
              <text>共赢计划</text>
            </view>
            <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
          </view>
        </view>
        <view class="account_main_list">
          <view class="account_main_list_item clear">
            <view class="fl">
              <image src="/static/myGM.png" mode=""></image>
              <text>在线客服</text>
            </view>
            <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
          </view>
          <view class="account_main_list_item clear">
            <view class="fl">
              <image src="/static/myHelp.png" mode=""></image>
              <text>帮助中心</text>
            </view>
            <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
          </view>
          <view class="account_main_list_item clear">
            <view class="fl">
              <image src="/static/shequn.png" mode=""></image>
              <text>社群群组</text>
            </view>
            <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
          </view>
        </view>
      </template>
    </view>
    <view class="account_logout"><button @click="logout">退出登录</button></view>

    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>

    <!-- 设置昵称 -->
    <Modal :title="'设置昵称'" v-if="isSetName" @close="closeModal('isSetName')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">昵称设置:</text>
            <view class="fr"><input type="text" v-model="nickname" placeholder="请输入昵称" /></view>
          </view>
        </view>
        <view class="common_btn"><button style="max-width: 157upx; border-radius: 8upx;" class="active" @click="setNickName()">确定</button></view>
        <view class="common_foot_tip">注：昵称只能设置一次，确认后无法修改</view>
      </view>
    </Modal>
  </view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import { uniIcon } from '@dcloudio/uni-ui';
import filter from '@/common/filter.js';
import { REG_EMAIL } from '@/common/reg.js';
import Modal from '@/components/lkex-modal/index.vue';
import service from './service.js';
import { mapGetters } from 'vuex';
export default {
  components: { uniIcon, Modal, HMmessages },
  data() {
    return {
      filter,
      nickname: '',
      isSetName: false
    };
  },
  computed: {
    ...mapGetters(['USERINFO'])
  },
  onShow() {
    if (this.$api.isLogin()) {
      this.$store.dispatch('getBasic');
      return false;
    }
    this.$api.goLogin('../login/login');
  },
  methods: {
    //设置昵称
    setNickName() {
      if (!this.nickname) {
        this.errors('请输入昵称');
        return false;
      }
      this.$api.showLoading();
      service
        .setNickName({
          nickName: this.nickname.replace(/\s/g, '')
        })
        .then(({ data }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            let that = this;
            that.closeModal('isSetName');
            that.$store.dispatch('getBasic');
            this.HMmessages.show('设置成功', {
              textAlign: 'center',
              background: '#356e36',
              fontColor: '#fff'
            });
          } else {
            this.errors(data.msg);
          }
        });
    },
    //隐藏弹窗
    closeModal(name, payPwd) {
      this[name] = false;
      this.nickname = '';
    },
    //错误提示
    errors(text) {
      this.HMmessages.show(text, {
        textAlign: 'center',
        background: '#74272d',
        fontColor: '#fff'
      });
    },
    //退出登录
    logout() {
      uni.removeStorageSync('LOGIN_TIME');
      uni.removeStorageSync('TOKEN');
      uni.removeStorageSync('markInfo');
      uni.reLaunch({
        url: '../login/login'
      });
    },
    formText(val, type) {
      if (type == 'real') {
        return val == 'LEVEL1' ? '认证一级' : '认证二级';
      } else if (type == 'nickname') {
        return val ? val : '未设置昵称';
      }
    },
    //格式化显示
    formatUser(val) {
      if (!val) {
        return '';
      }
      let account = val;
      if (REG_EMAIL.test(val)) {
        account = filter.email(val);
      } else {
        account = account[0] == '8' && account[1] == '6' ? filter.phone(account.replace('86', '')) : val;
      }
      return account;
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
