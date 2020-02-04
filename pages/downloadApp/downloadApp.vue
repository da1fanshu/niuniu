<template>
  <view class="content downloadApp">
    <view class="downloadApp_main">
      <view class="down_type">
        <a class="d_app" style="opacity:0.5">
          <text class="iconfont">&#xe68c;</text>
          <text>IOS版本暂未发布</text>
        </a>
        <a class="d_app" href="https://lkex.co//download/lkex.apk">
          <text class="iconfont">&#xe71e;</text>
          <text>下载Android版本</text>
        </a>
      </view>
      <view class="dwon_text">让交易更安全、更快捷、更高效</view>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {

      };
    },
    onShow() {
      let is_weixin = (function() {
        return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
      })();
      if (is_weixin) {
        uni.showModal({
          title: '提示',
          content: '请点击右上角浏览器打开进行下载',
          showCancel: false
        })
      }
    },
    methods: {},
  }
</script>

<style lang="scss">
  @import './style.scss';
</style>
