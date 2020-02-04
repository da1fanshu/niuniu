<template>
  <view class="content message">
    <view class="message_nav">
      <button :class="type == '' ? 'active' : ''" @click="setType('')">全部</button>
      <button :class="type == 'ASSETS' ? 'active' : ''" @click="setType('ASSETS')">资产</button>
      <button :class="type == 'SECURITY' ? 'active' : ''" @click="setType('SECURITY')">安全</button>
    </view>
    <scroll-view class="message_list" scroll-y @scrolltolower="load">
      <view class="message_list_main">
        <view class="item" v-for="(item, index) in list" :key="index">
          <view class="item_title clear">
            <view class="fl">
              <text class="sign" :class="item.userMessageCategory == 'SECURITY' ? 'warning' : ''">
                {{ item.userMessageCategory == 'SECURITY' ? '安全' : item.userMessageCategory == 'ASSETS' ? '资产' : 'C2C' }}
              </text>
              <text>{{ $formta(item.createDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
            </view>
            <!-- <text class="fr">详情 &gt;&gt;</text> -->
          </view>
          <view class="item_detailed">{{ item.content }}</view>
        </view>
      </view>
      <uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
    </scroll-view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from '../service.js';
import { uniLoadMore } from '@dcloudio/uni-ui';
export default {
  components: { HMmessages, uniLoadMore },
  data() {
    return {
      list: [],
      loading: true,
      pageNo: 1,
      pageSize: 10,
      noData: false,
      type: ''
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //设置类型
    setType(name) {
      if(this.loading){
        return false;
      }
      this.type = name;
      this.pageNo = 1;
      this.list = [];
      this.getList();
    },
    //获取消息列表
    getList() {
      this.loading = true;
      service
        .getMessageList({
          category: this.type,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(({ data }) => {
          this.loading = false;
          if (data.code == '100200') {
            this.list = this.list.concat(data.data.list);
            if (data.data.pageNum == 1 || data.data.pageNum == 0) {
              this.noData = true;
              return false;
            }
            if (this.pageNo >= data.data.pageNum) {
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
      this.getList();
    },
    //错误提示
    errors(text) {
      this.HMmessages.show(text, {
        textAlign: 'center',
        background: '#74272d',
        fontColor: '#fff'
      });
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
