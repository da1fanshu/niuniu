<script>
export default {
  onLaunch: function() {
    
    // #ifdef APP-PLUS
    // plus.screen.lockOrientation('portrait-primary'); //锁定
    // 监听点击消息事件
    // plus.push.addEventListener(
    //   'click',
    //   function(msg) {
    //     var payload = plus.os.name == 'iOS' ? msg.payload : JSON.parse(msg.payload);
    //   },
    //   false
    // );

    // 监听在线消息事件
    // plus.push.addEventListener(
    //   'receive',
    //   function(msg) {
    //     logoutPushMsg(msg);
    //   },
    //   false
    // );

    //获取穿透参数
    function logoutPushMsg(msg) {
      if (msg.payload) {
        if (typeof msg.payload == 'string') {
          createLocalPushMsg(msg.content);
        } else {
          var data = JSON.parse(msg.payload);
          createLocalPushMsg(data.content);
        }
      } else {
        
      }
    }

    //获取推送透传的数据
    function createLocalPushMsg(content) {
      let data = JSON.parse(content);
      if (data.url.indexOf('articleDetails') > -1) {
        let Url = data.url.split('?');
        uni.navigateTo({
          url: `/pages/index/newInfo/newDetails/newDetails?${Url[1]}`
        });
      }
      // console.log(JSON.stringify(data));
      // that.$router.push("/" + data.url);
      // var options = { cover: true };
      // plus.push.createMessage(content, "LocalMSG", options);
      // if (plus.os.name == "iOS") {
      //   alert('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
      // }
    }
    // #endif
  },
  onShow: function() {
    // #ifdef APP-PLUS
    let that = this;
    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
      // inf.version;
      that.$store.commit('setVersion', inf);
    });
    // #endif
  },
  onHide: function() {
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: 'iconfont';
  src: url('~@/static/font/iconfont.ttf');
}

.iconfont {
  font-family: iconfont;
}

@import url('/components/gaoyia-parse/parse.css');

.uni-mask {
  z-index: 997 !important;
}

.uni-popup {
  padding: 0 !important;
  background: none !important;
}

textarea {
  height: 100%;
  width: 100%;
}

uni-input div {
  width: 100%;
}

page {
  display: flex;
  flex: 1;
  background-color: $appBg;
  min-height: 100%;
  position: relative;
}

/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';

/*每个页面公共css */
.down_app {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  padding-left: 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 32rpx;

  .fl {
    width: calc(100% - 80rpx);
  }
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  min-height: 100%;
}

.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #191e2a;
}

.top_view {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  background-color: #191e2a;
  top: 0;
  z-index: 999;
}

.clear:after {
  content: ''; //设置内容为空
  height: 0; //高度为0
  line-height: 0; //行高为0
  display: block; //将文本转为块级元素
  visibility: hidden; //将元素隐藏
  clear: both; //清除浮动
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.icon-cion {
  display: inline-block;
  // background-image: url('https://whole.winmax.me/bch@2x.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain; // ipt
}

.common_model {
  padding: 17upx 20upx;
  box-sizing: border-box;
  color: #fff;
  font-size: 24upx;

  .common_form {
    padding-bottom: 20upx;
    .item {
      font-size: 24upx;
      margin-bottom: 20upx;

      .fl {
        width: 150upx;
        line-height: 51upx;
        color: #fff;
      }

      .fr {
        width: calc(100% - 150upx);
        border-radius: 8upx;
        background: #1e2432;
        height: 51upx;
        color: #fff;
        position: relative;

        input {
          padding: 0 24upx;
          font-size: 26rpx;
          line-height: 51rpx;
          height: 100%;
        }

        picker {
          .uni-input {
            height: 100%;
            padding: 0 24upx;
            line-height: 51upx;
            background: none;
          }
        }

        .downs {
          position: absolute;
          top: 0;
          right: 16upx;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      &.imgCode {
        .code {
          float: right;
          width: 140upx;
          height: 100%;
          padding-right: 30upx;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;

          button {
            font-size: 22upx;
            padding: 0;
            width: 100%;
            background: none;
            border: 0;
            color: #12abb0;
          }
        }
      }
    }
  }

  .common_btn {
    display: flex;
    border-radius: 8upx;
    overflow: hidden;

    button {
      flex: 1;
      height: 65upx;
      line-height: 65upx;
      background: #1e2432;
      border: 0;
      border-radius: 0;
      color: #fff;
      font-size: 24upx;
      transition: all 0.1s;

      &::after {
        display: none;
      }

      &:active {
        opacity: 0.5;
      }

      &.active {
        background: #03bcc0;
        color: #fff;
      }
    }
  }

  .common_foot_tip {
    margin-top: 20upx;
    margin-bottom: 10upx;
    color: #b6b9bf;
    font-size: 24upx;
  }
}


// 红包海报
.hideCanvasView {
  position: relative;
}

.hideCanvas {
  position: fixed;
  top: -99999upx;
  left: -99999upx;
  z-index: -99999;
}

.flex_row_c_c {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.modalView {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  outline: 0;
  transform: scale(3);
  perspective: 2500upx;
  background: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  backface-visibility: hidden;
  z-index: 999;
}

.modalView.show {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

.flex_column {
  display: flex;
  flex-direction: column;
}

.backgroundColor-white {
  background-color: white;
}

.border_radius_10px {
  border-radius: 10px;
}

.padding1vh {
  padding: 1vh;
}

.posterImage {
  width: 60vw;
}

.flex_row {
  display: flex;
  flex-direction: row;
  .d_img {
    color: #fff;
    text-decoration: none;
    display: inline-block;
    background: #007aff;
    line-height: 2.3;
    font-size: 26rpx;
    border-radius: 10rpx;
    padding: 0 1.34em;
    margin-left: auto;
    margin-right: auto;
  }
}

.marginTop2vh {
  margin-top: 2vh;
}
</style>
