<template>
  <view class="content">
    <view class="allAssets_list">
      <view class="allAssets_list_item clear">
        <view class="fl">充币记录</view>
        <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
      </view>
      <view class="allAssets_list_item clear">
        <view class="fl">充币记录</view>
        <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
      </view>
      <view class="allAssets_list_item clear">
        <view class="fl">充币记录</view>
        <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
      </view>
    </view>
    <view class="allAssets_list" style="margin: 12upx 0; ">
      <view class="allAssets_list_item clear">
        <view class="fl">C2C交易记录</view>
        <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
      </view>
    </view>
    <view class="allAssets_list">
      <view class="allAssets_list_item clear">
        <view class="fl">当前委托记录</view>
        <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
      </view>
      <view class="allAssets_list_item clear">
        <view class="fl">历史委托记录</view>
        <view class="fr"><uni-icon type="arrowright" :color="'#fff'" size="20"></uni-icon></view>
      </view>
    </view>
  </view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
export default {
  components: { uniIcon },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.allAssets_list {
  background: $maskBg;
  padding: 0 20upx;
  .allAssets_list_item {
    transition: all 0.2s;
    &:active {
      opacity: 0.5;
    }
    height: 80upx;
    padding: 0 24upx;
    position: relative;
    &::before{
      display: block;
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1upx;
      background: #6d717a;
      transform: scaleY(0.5);
    }
    &:last-child {
      &::before{
        display: none;
      }
    }
    .fl {
      color: #fff;
      line-height: 80upx;
      font-size: 23upx;
    }
    .fr {
      height: 80upx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
