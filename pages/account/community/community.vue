<template>
	<view class="content">
		<view class="community">
		  <view class="community_main_list">
		    <view class="community_main_list_item clear" @click="isShowWX = true">
		      <view class="fl">
		        <image src="/static/account/weixin.png" mode="" style="width: 35rpx; height: 28rpx;"></image>
		        <text>微信客服</text>
		      </view>
		      <view class="fr">
            <text>zhang890906su</text>
            <!-- <uni-icons type="arrowright" :color="'#fff'" size="20"></uni-icons> -->
          </view>
		    </view>
        <view class="community_main_list_item clear" @click="isShowQQ = true">
          <view class="fl">
            <image src="/static/account/qq.png" mode="" style="width: 26rpx; height: 31rpx;"></image>
            <text>QQ交流群</text>
          </view>
          <view class="fr">
            <text>531969541</text>
          </view>
        </view>
        <view class="community_main_list_item clear">
          <view class="fl">
            <image src="/static/account/wb.png" mode="" style="width: 33rpx; height: 27rpx;"></image>
            <text>微博</text>
          </view>
          <view class="fr">
            <text>lkex</text>
          </view>
        </view>
        <view class="community_main_list_item clear">
          <view class="fl">
            <image src="/static/account/tw.png" mode="" style="width: 31rpx; height: 26rpx;"></image>
            <text>Twitter</text>
          </view>
          <view class="fr">
            <text>lkex73224960</text>
          </view>
        </view>
        <view class="community_main_list_item clear">
          <view class="fl">
            <image src="/static/account/fb.png" mode="" style="width: 18rpx; height: 32rpx; margin-left: 10rpx;"></image>
            <text>Facebook</text>
          </view>
          <view class="fr">
            <text>win.max.9883</text>
          </view>
        </view>
		  </view>
      
      <view v-if="isShowQQ" class="community_modal" @click="isShowQQ = !isShowQQ">
        <view class="modal_main">
          <view class="modal_title">
            <text>官方QQ交流群</text>
            <button><uni-icons type="closeempty" size="30" color="#979aa0"></uni-icons></button>
          </view>
          <view class="modal_title_tip">lkex官方服务群（QQ群：531969541）</view>
          <view class="modal_code">
            <image src="/static/account/qq.gif" mode=""></image>
          </view>
        </view>
      </view>
      <view v-if="isShowWX" class="community_modal" @click="isShowWX = !isShowWX">
        <view class="modal_main">
          <view class="modal_title">
            <text>微信客服</text>
            <button><uni-icons type="closeempty" size="30" color="#979aa0"></uni-icons></button>
          </view>
          <view class="modal_title_tip">添加客服时需备注：lkex入群</view>
          <view class="modal_code">
            <image src="/static/account/wxkf.jpg" mode=""></image>
          </view>
        </view>
      </view>
		</view>
	</view>
</template>

<script>
  import { uniIcon } from '@dcloudio/uni-ui';
	export default {
    components: { uniIcon},
		data() {
			return {
				isShowQQ:false,
        isShowWX:false,
			};
		}
	}
</script>

<style lang="scss">
@import './style.scss';
</style>
