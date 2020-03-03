<template>
  <view class="content">
    <scroll-view style="height: 100%;" scroll-y @scrolltolower="load">
      <view class="c2cCreated">
        <view class="created_nav">
          <button :class="type == 'SELL' ? 'active' : ''" @click="type = 'SELL'">出售展示</button>
          <button :class="type == 'BUY' ? 'active' : ''" @click="type = 'BUY'">收购展示</button>
        </view>
        <view class="created_created" @click="goPage(type)">
          <view class="puls"><uni-icons type="plusempty" :color="'#191e2a'"></uni-icons></view>
          <text style="margin-top: 12upx;">点击添加订单发布</text>
        </view>
        <block v-for="(item, index) in list" :key="index">
          <view class="created_list">
            <view class="created_list_item">
              <view class="item_orderNum clear">
                <text class="fl">{{ item.assetcode || item.assetCode }} {{ type == 'SELL' ? '出售' : '收购' }}</text>
                <text class="fr">订单号：{{ item.advertId }}</text>
              </view>
              <view class="item">
                <text class="fl">发布时间：</text>
                <text class="fr">{{ $formta(item.createDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
              </view>
              <view class="item">
                <text class="fl">每笔最少：</text>
                <text class="fr">{{ filter.fix(type == 'SELL' ? item.minAmount : item.purchaseMin, 2) }} {{ item.assetcode || item.assetCode }}</text>
              </view>
              <view class="item">
                <text class="fl">{{ type == 'SELL' ? '出售数量' : '收购数量' }}：</text>
                <text class="fr">{{ filter.fix(type == 'SELL' ? item.maxAmount : item.purchaseMax, 2) }} {{ item.assetcode || item.assetCode }}</text>
              </view>
              <view class="item">
                <text class="fl">{{ type == 'SELL' ? '已售数量' : '已收数量' }}：</text>
                <text class="fr">
                  <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.fix(type == 'SELL' ? item.hadSellNum : item.hadPurchaseNum, 2) }}</text>
                  {{ item.assetcode || item.assetCode }}
                </text>
              </view>
              <view class="item">
                <text class="fl">交易价格：</text>
                <text class="fr">
                  <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.tradePrice, 2) }}</text>
                  {{ item.currency }} / {{ item.assetcode || item.assetCode }}
                </text>
              </view>
              <view class="item">
                <text class="fl">交易状态：</text>
                <text class="fr" :style="item.statusColor">{{ Text(item.status) }}</text>
              </view>
              <view class="item_status clear">
                <view class="btn_status"><button v-if="item.status == 'SHOW'" class="active" @click="del(item)">撤销</button></view>
              </view>
            </view>
          </view>
        </block>
      </view>
      <uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
    </scroll-view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import { uniIcon, uniLoadMore } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import filter from '@/common/filter.js';
import service from '../service.js';
export default {
  components: { uniIcon, HMmessages, uniLoadMore },
  data() {
    return {
      filter,
      type: 'SELL', //SELL,BUY
      loading: true,
      noData: false,
      list: [],
      pageNo: 1,
      pageSize: 10
    };
  },
  onShow() {
    if (this.$api.isLogin()) {
      this.pageNo = 1;
      this.list = [];
      this.noData = false;
      this.getList();
      return false;
    }
    this.$api.goLogin('../../login/login');
  },
  watch:{
    type(){
      this.pageNo = 1;
      this.list= [];
      this.noData = false;
      this.getList();
    },
  },
  methods: {
    //出售删除
    del(item) {
      let that = this;
      uni.showModal({
        title: '提示',
        content: '是否撤销当前挂单？',
        success: res => {
          if (res.confirm) {
            that.$api.showLoading();
            let name = that.type == 'SELL' ? 'sellAdvertDelete' : 'buyAdvertDelete';
            service[name]({
              advertId: item.advertId
            }).then(({ data }) => {
              that.$api.hideLoading();
              if (data.code == '100200') {
                that.HMmessages.show('撤单成功', {
                  textAlign: 'center',
                  background: '#356e36',
                  fontColor: '#fff',
                  callback: () => {
                    that.list = [];
                    that.pageNo = 1;
                    that.noData = false;
                    that.getList();
                  }
                });
              } else {
                that.errors(data.msg);
              }
            });
          }
        }
      });
    },
    //获取挂单数据
    getList() {
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      let name = this.type == 'SELL' ? 'myAdvertQuerySell' : 'myAdvertQueryBuy';
      this.loading = true;
      service[name](param).then(({ data }) => {
        this.loading = false;
        if (data.code == '100200') {
          data.data.list.map((e, i) => {
            e.statusColor = this.colorText(e.status);
          });
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
    //前往页面
    goPage(type) {
      uni.navigateTo({
        url: `createdDetailed/createdDetailed?type=${type}`
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
    //返回提示文字
    Text(status) {
      let obj = {
        SHOW: '展示中',
        UNSHOW: '隐藏中',
        PROCESSING: '发布交易中',
        PROCESSED: '发布交易完成',
        DELETED: '发布已删除',
        PURCHASED: '发布交易完成',
        PURCHASING: '发布交易中'
      };
      return obj[status];
    },
    //返回提示颜色
    colorText(status) {
      let color = '';
      switch (status) {
        case 'SHOW':
          color = '#f0c61e';
          break;
        case 'UNSHOW':
          color = '#fff59d';
          break;
        case 'PROCESSING':
          color = '#9e9e9e';
          break;
        case 'PROCESSED':
          color = '#26c91a';
          break;
        case 'DELETED':
          color = '#ec5151';
          break;
        case 'PURCHASED':
          color = '#26c91a';
          break;
        case 'PURCHASING':
          color = '#9e9e9e';
          break;
      }
      return {
        color: color
      };
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
