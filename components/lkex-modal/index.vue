<template>
  <view class="Modal_mask" :class="mClass">
    <view class="Modal_Modal">
      <view class="Modal_title">
        <text class="title">{{ title }}</text>
        <view class="colse">
          <button @click.stop="closes"><uni-icon type="closeempty" size="25" color="#fff"></uni-icon></button>
        </view>
      </view>
      <view class="Model_conter"><slot></slot></view>
    </view>
  </view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
export default {
  name: 'lkex-modal',
  components: { uniIcon },
  props: {
    mClass: {
      type: String,
      default: ''
    },
    title: {
      type: String
    },
    isShowClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    hideModal() {
      if (this.isMask) {
        this.$emit('close');
      }
    },
    closes() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss">
.Modal_mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  .Modal_Modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 680upx;
    background: #525b6e;
    border-radius: 8upx;
    .Modal_title {
      position: relative;
      height: 75upx;
      .title {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28upx;
        color: $fontColor;
      }
      .colse {
        z-index: 2;
        position: absolute;
        height: 75upx;
        top: 0;
        bottom: 0;
        right: 20upx;
        display: flex;
        justify-content: center;
        align-items: center;
        button {
          height: 50upx;
          width: 50upx;
          padding: 0;
          line-height: 50upx;
          display: flex;
          justify-content: center;
          align-items: center;
          background: $maskBg;
          border: none;
          border-radius: 50upx;
          &::after {
            display: none;
          }
        }
      }
    }
  }
}

// 红包样式
.luckDraw_modal {
  .Modal_Modal {
    width: 550rpx;
    background: #f25542;
    .Modal_title {
      height: 90rpx;
      .title {
        color: #fde1b1;
        font-size: 32rpx;
      }
      .colse {
        height: 90rpx;
        right:40rpx;
        button {
          background: #fde1b1;
          .uni-icon {
            color: #f25542 !important;
          }
        }
      }
    }
  }
}
</style>
