<template>
  <view class="content">
    <scroll-view :style="{ height: '100%' }" scroll-y @scrolltolower="load">
      <swiper style="height: 307upx; background: #03BCC0;" :autoplay="true" :circular="true" :interval="5000" :duration="1000">
        <swiper-item v-for="(item, index) in IMGLIST" :key="index">
          <view class="swiper-item"><image :lazy-load="true" :src="item.imageAddress" style="width: 100%; height: 307upx;" mode=""></image></view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item"><image :lazy-load="true" src="/static/banner1.gif" style="width: 100%; height: 307upx;" mode=""></image></view>
        </swiper-item>
        <swiper-item v-if="!IMGLIST[0]"><uni-load-more color="#fff" status="loading"></uni-load-more></swiper-item>
      </swiper>

      <view class="newInfo_main">
        <view class="newInfo_main_main">
          <view class="newInfo_main_title">最新活动快报</view>
          <view class="newInfo_main_list" v-for="(item, index) in list" :key="index" @click="$goPage('newDetails/newDetails?id=' + item.id)">
            <image class="fl" lazy-load="true" :src="item.articleCover" mode=""></image>
            <view class="fr">
              <text style="color: #acadb0;">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm') }}</text>
              <text style="font-size: 28upx;;">{{ item.title }}</text>
              <text style="color: #acaeb1;">{{ item.summary }}</text>
            </view>
          </view>
          <uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
        </view>
      </view>
      <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
    </scroll-view>
  </view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
import service from '../service.js';
import { mapGetters } from 'vuex';
export default {
  components: {
    HMmessages,
    uniLoadMore
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      list: [],
      loading: true,
      noData: false
    };
  },
  mounted() {
    this.getNewList();
  },
  computed: {
    ...mapGetters(['IMGLIST'])
  },
  methods: {
    //获取公告资讯
    getNewList() {
      let that = this;
      this.loading = true;
      service
        .getNewList({
          type: 'ACTIVITY',
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(({ data }) => {
          this.loading = false;
          if (data.code == '100200') {
            data.data.records.map((e, i) => {
              if (e.articleCover.indexOf('/bera-manage/news/') > -1) {
                e.articleCover = that.$api.baseUrl + e.articleCover;
              }
            });
            this.list = this.list.concat(data.data.records);
            if (data.data.pages == 1 || data.data.pages == 0) {
              this.noData = true;
              return false;
            }
            if (this.pageNo >= data.data.pages) {
              this.noData = true;
            } else {
              this.noData = false;
            }
          } else {
            this.pageNo--;
            this.errors(data.msg);
          }
        });
    },
    //错误提示
    errors(text) {
      this.HMmessages.show(text, {
        textAlign: 'center',
        background: '#74272d',
        fontColor: '#fff'
      });
    },
    //加载更多
    load() {
      if (this.loading) {
        return false;
      }
      if (this.noData) {
        return false;
      }
      this.pageNo++;
      this.loading = true;
      this.getNewList();
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
