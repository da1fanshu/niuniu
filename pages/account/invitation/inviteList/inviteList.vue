<template>
	<view class="content">
    <view class="inviteList">
      <view class="i_header">
        <view class="header_title">我的邀请人数(未认证账户将无法获得奖励)</view>
        <view class="header_number">
          <text style="font-size: 68rpx; font-weight: bold;">{{list.length}}</text>
          <text>人</text>
        </view>
      </view>
      <view class="inviteList_list">
        <view class="list_nav">
          <text class="flex" style="max-width: 150rpx;">UID</text>
          <text class="flex">账号</text>
          <text class="flex" style="text-align: right;">注册时间</text>
        </view>
        <view class="list_main">
          <view class="item" v-for="(item,index) in list" :key="index">
            <text class="flex" style="max-width: 150rpx;">{{filter.getFormattedUid(item.uid)}}</text>
            <text class="flex">{{REG_EMAIL.test(item.account) ? filter.email(item.account) : filter.getSuffixPhone(item.account)}}{{item.authFlag == 'INIT' ? '(未认证)':''}}</text>
            <text class="flex" style="text-align: right; color: #797979; max-width: 160rpx;">{{$formta(item.createTime,'yyyy-MM-dd')}}</text>
          </view>
        </view>
        <uni-load-more :status="loading ? 'loading' : !list[0] ? 'noMore' : 'noMore'"></uni-load-more>
      </view>
    </view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
  import HMmessages from '@/components/HM-messages/HM-messages.vue';
  import service from '../../service.js';
  import filter from '@/common/filter.js';
  import { uniLoadMore } from '@dcloudio/uni-ui';
  import {REG_EMAIL} from '@/common/reg.js';
	export default {
    components: {
      HMmessages,
      uniLoadMore
    },
		data() {
			return {
        REG_EMAIL,
        filter,
				list:[],
        loading:true,
			};
		},
    onLoad() {
      this.getInviteList();
    },
    methods:{
      //获取邀请列表
      getInviteList(){
        this.loading = true;
        service.getInviteList().then(({data})=>{
          this.loading = false;
          if(data.code == '100200'){
            this.list = data.data;
          }else{
            this.errors(data.msg);
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
    }
	}
</script>

<style lang="scss">
@import './style.scss';
</style>
