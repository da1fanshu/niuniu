<template>
  <view class="newDetails">
    <template v-if="loadings">
      <view class="banner"><image class="banner-img" :src="cover"></image></view>
      <view class="banner-title">{{ title }}</view>
      <view class="newDetails_main">
        <uParse :content="article" :imageProp="{ domain: 'lkex.co' }" @preview="preview" @navigate="navigate" />
      </view>
    </template>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import uParse from '@/components/gaoyia-parse/parse.vue';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
export default {
  components: {
    uParse,
    HMmessages
  },
  data() {
    return {
      article: '',
      loadings: false,
      cover: '',
      title: '',
      address:'',
      summary:'',
    };
  },
  onNavigationBarButtonTap(e) {
    let text = this.summary;
    let imgUrl = 'http://nnex.io//' + `${this.shareImg}`;
    let that = this;
    let arr = ['分享到微信好友', '分享到微信朋友圈', '复制资讯链接', '取消分享'];
    // #ifdef H5
    arr = ['复制资讯链接'];
    // #endif
    uni.showActionSheet({
      itemList: arr,
      success: function(res) {
        // #ifdef APP-PLUS
        if (res.tapIndex == 0) {
          uni.share({
            provider: 'weixin',
            scene: 'WXSceneSession',
            type: 0,
            href: that.address,
            title: that.title,
            summary: text,
            imageUrl: imgUrl,
            success: function(res) {
              console.log('success:' + JSON.stringify(res));
            },
            fail: function(err) {
              console.log('fail:' + JSON.stringify(err));
            }
          });
        } else if (res.tapIndex == 1) {
          uni.share({
            provider: 'weixin',
            scene: 'WXSenceTimeline',
            type: 0,
            href: that.address,
            title: that.title,
            summary: text,
            imageUrl: imgUrl,
            success: function(res) {
              console.log('success:' + JSON.stringify(res));
            },
            fail: function(err) {
              console.log('fail:' + JSON.stringify(err));
            }
          });
        } else if (res.tapIndex == 2) {
          that.copy(that.address);
        }
        // #endif
        // #ifdef H5
        if (res.tapIndex == 0) {
          that.copy(that.address);
        }
        // #endif
        // console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
      },
      fail: function(res) {
        // console.log(res.errMsg);
      }
    });
  },
  onLoad(option) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    });
    this.$api
      .get('/bera-manage/news/news-detail', {
        id: option.id
      })
      .then(({ data }) => {
        uni.hideLoading();
        if (data.code == '100200') {
          this.title = data.data.title;
          if (data.data.coverImage.indexOf('/bera-manage/news/image-get') > -1) {
            this.cover = this.$api.baseUrl + data.data.coverImage;
          } else {
            this.cover = data.data.coverImage;
          }
          this.summary = data.data.summary;
          this.shareImg = data.data.coverImage;
          this.address = 'http://nnex.io/' + `/#/pages/index/newInfo/newDetails/newDetails?id=${data.data.id}`;
          this.article = data.data.content.replace(new RegExp('/bera-manage/news/image-get', 'g'), `${this.$api.baseUrl}/bera-manage/news/image-get`);
          this.loadings = true;
          uni.setNavigationBarTitle({
            title: data.data.title
          });
        } else {
          this.errors(data.msg);
        }
      });
  },
  methods: {
    preview(src, e) {
      // do something
      // console.log(src);
    },
    navigate(href, e) {
      // do something
      // console.log(href);
    },
    //错误提示
    errors(text) {
      this.HMmessages.show(text, {
        textAlign: 'center',
        background: '#74272d',
        fontColor: '#fff'
      });
    },
    //复制
    copy(text) {
      let that = this;
      uni.setClipboardData({
        data: text,
        success: () => {
          that.HMmessages.show('复制成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
