<template name="HM-messages">
  <view
    class="HMmessages"
    :class="[isShow ? 'show' : 'hide', isStatus ? 'status' : '', isTransparent ? 'transparent' : '', isTransparentH5 ? 'transparentH5' : '']"
    :style="{ backgroundColor: background }"
  >
    <view class="contents" :style="{ color: fontColor, justifyContent: textAlign }" @tap="clickMessage">{{ content }}</view>
    <view class="closeBtn" v-if="closeButton" @tap="close" :style="{ color: closeButtonColor }"><view class="icon close"></view></view>
  </view>
</template>
<script>
export default {
  name: 'HM-messages',
  data() {
    return {
      isTransparent: false,
      isTransparentH5: false,
      isStatus: false,
      isShow: false,
      content: '',
      icon: 'none',
      background: '',
      closeButton: false,
      closeButtonColor: '',
      fontColor: '',
      iconColor: '',
      textAlign: '',
      data: null
    };
  },
  mounted() {
    this.$emit('complete');
  },
  methods: {
    clickMessage() {
      this.$emit('clickMessage', this.data);
    },
    Timer() {},
    show(content, Setting) {
      if (!content || typeof content != 'string') {
        return;
      }
      this.checkTitleNView(() => {
        this.Timer && clearTimeout(this.Timer); //清除计时器
        let iconColorArray = {
          remind: '#5a89ff',
          error: '#ef6160',
          danger: '#ff0000',
          success: '#0ec469',
          disable: '#8c56a0',
          help: '#5fb5f5'
        };
        let defaultSetting = {
          icon: 'remind',
          content: content,
          duration: 2000,
          background: 'rgba(238,238,238,0.8)',
          closeButton: false,
          closeButtonColor: '#555555',
          iconColor: iconColorArray['remind'],
          fontColor: '#555555',
          textAlign: 'flex-start',
          data: null
        };
        if (Setting && !Setting.hasOwnProperty('iconColor') && Setting.hasOwnProperty('icon')) {
          Setting.iconColor = iconColorArray[Setting.icon];
        }
        Setting = Setting ? this.extend(defaultSetting, Setting) : defaultSetting;
        if (this.isShow) {
          this.close();
          setTimeout(() => {
            this.setSetting(Setting);
          }, 150);
        } else {
          this.setSetting(Setting);
        }
      });
    },
    checkTitleNView(fun) {
      //#ifdef APP-PLUS
      var titleNView = plus.webview.getTopWebview().getStyle().titleNView ? plus.webview.getTopWebview().getStyle().titleNView : {};
      if (!titleNView.type) {
        this.isStatus = true;
        fun();
      } else if (titleNView.type == 'transparent') {
        this.isStatus = true;
        uni
          .createSelectorQuery()
          .selectViewport()
          .scrollOffset(res => {
            if (res.scrollTop > 0) {
              this.isTransparent = true;
            } else {
              this.isStatus = true;
              this.isTransparent = false;
            }
            fun();
          })
          .exec();
      } else {
        fun();
      }
      //#endif
      //#ifdef H5
      var headDOM = document.getElementsByClassName('uni-page-head');
      if (headDOM.length > 0) {
        if (headDOM[0].className.indexOf('transparent') > -1) {
          uni
            .createSelectorQuery()
            .selectViewport()
            .scrollOffset(res => {
              if (res.scrollTop > 0) {
                this.isTransparentH5 = true;
              } else {
                this.isTransparentH5 = false;
              }
              fun();
            })
            .exec();
        } else {
          this.isTransparentH5 = true;
          fun();
        }
      } else {
        fun();
      }
      //#endif
      //#ifndef APP-PLUS||H5
      fun();
      //#endif
    },
    setSetting(Setting) {
      this.content = Setting.content;
      this.icon = Setting.icon;
      this.background = Setting.background;
      this.closeButton = Setting.closeButton;
      this.closeButtonColor = Setting.closeButtonColor;
      this.fontColor = Setting.fontColor;
      this.iconColor = Setting.iconColor;
      this.textAlign = Setting.textAlign;
      this.data = Setting.data;
      this.isShow = true;
      this.callback = Setting.callback;
      if (Setting.duration > 0) {
        this.Timer = setTimeout(() => {
          this.close();
        }, Setting.duration);
      }
    },
    close() {
      this.isShow = false;
      if(this.callback && typeof this.callback == 'function'){
        this.callback()
      }
      this.Timer && clearTimeout(this.Timer); //清除计时器
    },
    extend(destination, source) {
      for (let property in source) {
        destination[property] = source[property];
      }
      return destination;
    }
  }
};
</script>

<style>
.HMmessages.status {
  padding-top: var(--status-bar-height);
}
.HMmessages.transparent {
  padding-top: calc(var(--status-bar-height) + 88upx);
}
.HMmessages.transparentH5 {
  padding-top: 44px;
}

.HMmessages {
  width: 100%;
  height: 50upx;
  position: fixed;
  top: -80upx;
  left: 0;
  z-index: 997;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.HMmessages.show {
  animation: show 0.3s linear both;
}
.HMmessages.hide {
  animation: hide 0.3s linear both;
}
@keyframes show {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  100% {
    transform: translateY(80upx);
    opacity: 1;
  }
}
@keyframes hide {
  0% {
    transform: translateY(80upx);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}
.HMmessages .contents {
  width: 100%;
  height: 50upx;
  padding: 0 2%;
  font-size: 28upx;
  white-space: nowrap;
  display: flex;
  align-items: center;
  overflow: hidden;
}
</style>
