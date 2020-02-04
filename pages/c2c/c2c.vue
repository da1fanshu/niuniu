<template>
  <view class="content">
    <scroll-view style="height: 100%;" scroll-y @scrolltolower="load">
      <!-- #ifdef APP-PLUS -->
      <view class="status_bar"><view class="top_view"></view></view>
      <!-- #endif -->
      <view class="c2c">
        <view class="c2c_nav">
          <block v-for="(item,index) in cexchange" :key="index">
            <button :class="coin == item.name ? 'active' : ''" @click="setCoin(item.name)">{{item.name}}</button>
          </block>
        </view>
        <view class="c2c_type">
          <button :class="type == 'BUY' ? 'active' : ''" @click="setType('BUY')">购买</button>
          <button :class="type == 'SELL' ? 'active' : ''" @click="setType('SELL')">出售</button>
          <button :class="type == 'LIST' ? 'active' : ''" @click="setType('LIST')">记录</button>
        </view>
        <view class="c2c_list">
          <template v-if="type == 'BUY' || type == 'SELL'">
            <block v-for="(item, index) in list" :key="index">
              <template v-if="type == 'BUY'">
                <view class="c2c_list_item">
                  <view class="item_title clear">
                    <text class="fl icons">{{ item.c2cTransactionInfoDto.nickName[0] }}</text>
                    <text class="fl name">{{ item.c2cTransactionInfoDto.nickName }}</text>
                    <text class="iconfont" style="color: #f0c61e; font-size: 28upx;">{{ item.member == 'VIP1' ? '&#xe73b;' : item.member == 'VIP2' ? '&#xe73a;' : '&#xe739;' }}</text>
                    <image v-if="item.currency == 'CNY'" src="/static/c2c/china.png"></image>
                    <image v-if="item.currency == 'HKD'" src="/static/c2c/hongkong.png"></image>
                    <image v-if="item.currency == 'USD'" src="/static/c2c/cambodia.png"></image>
                    <image v-if="item.currency == 'MY'" src="/static/c2c/malaysia.png"></image>
                    <image v-if="item.currency == 'PHP'" src="/static/c2c/philippines.png"></image>
                    <image v-if="item.currency == 'SGD'" src="/static/c2c/singapore.png"></image>
                    <image v-if="item.currency == 'THB'" src="/static/c2c/thailand.png"></image>
                  </view>
                  <view class="item_number clear">
                    <text class="fl">出售剩余：{{ type == 'BUY' ? filter.floorFix(item.maxAmount - item.hadSellNum, 2) : filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2) }} {{ coin }}</text>
                    <text class="fr">成交量：{{ item.c2cTransactionInfoDto.totalCount }} 笔</text>
                  </view>
                  <view class="item_number clear">
                    <text class="fl">
                      限额：{{ filter.floorFix(item.minAmount > item.maxAmount - item.hadSellNum ? item.maxAmount - item.hadSellNum : item.minAmount, 2) }} ~ {{ filter.floorFix(item.maxAmount - item.hadSellNum, 2) }} {{ coin }}
                    </text>
                    <text class="fr">
                      单价：
                      <text>{{ filter.floorFix(item.tradePrice, 2) }} {{ item.currency }}</text>
                    </text>
                  </view>
                  <view class="item_type clear">
                    <view class="fl">
                      <text>支付方式：</text>
                      <text class="iconfont" v-for="(items, index) in item.payType" :key="index" :style="{ color: items == 'ALIPAY' ? '#00aaef' : '#e3a50e' }">
                        {{ items == 'BANK' ? '&#xe80a;' : '&#xe614;' }}
                      </text>
                    </view>
                    <button class="fr" @click="$goPage(`c2cDetails/c2cDetails?advertId=${item.advertId}&type=BUY`)">购买</button>
                  </view>
                </view>
              </template>
              <template v-if="type == 'SELL'">
                <view class="c2c_list_item">
                  <view class="item_title clear">
                    <text class="fl icons">{{ item.c2cTransactionInfoDto.nickName[0] }}</text>
                    <text class="fl name">{{ item.c2cTransactionInfoDto.nickName }}</text>
                    <text class="iconfont" style="color: #f0c61e; font-size: 28upx;">{{ item.member == 'VIP1' ? '&#xe73b;' : item.member == 'VIP2' ? '&#xe73a;' : '&#xe739;' }}</text>
                    <image v-if="item.currency == 'CNY'" src="/static/c2c/china.png"></image>
                    <image v-if="item.currency == 'HKD'" src="/static/c2c/hongkong.png"></image>
                    <image v-if="item.currency == 'USD'" src="/static/c2c/cambodia.png"></image>
                    <image v-if="item.currency == 'MY'" src="/static/c2c/malaysia.png"></image>
                    <image v-if="item.currency == 'PHP'" src="/static/c2c/philippines.png"></image>
                    <image v-if="item.currency == 'SGD'" src="/static/c2c/singapore.png"></image>
                    <image v-if="item.currency == 'THB'" src="/static/c2c/thailand.png"></image>
                  </view>
                  <view class="item_number clear">
                    <text class="fl">收购剩余：{{type == 'BUY' ? filter.floorFix((item.maxAmount - item.hadSellNum),2) : filter.floorFix((item.purchaseMax - item.hadPurchaseNum),2)}} {{coin}}</text>
                    <text class="fr">成交量：{{ item.c2cTransactionInfoDto.totalCount }} 笔</text>
                  </view>
                  <view class="item_number clear">
                    <text class="fl">限额：{{filter.floorFix(item.purchaseMin > (item.purchaseMax-item.hadPurchaseNum) ? (item.purchaseMax-item.hadPurchaseNum) : item.purchaseMin,2)}} ~ {{filter.floorFix((item.purchaseMax-item.hadPurchaseNum),2)}} {{coin}}</text>
                    <text class="fr">
                      单价：
                      <text>{{ filter.floorFix(item.tradePrice, 2) }} {{ item.currency }}</text>
                    </text>
                  </view>
                  <view class="item_type clear">
                    <view class="fl">
                      <text>支付方式：</text>
                      <text class="iconfont" style="color:#00aaef;">&#xe614;</text>
                      <text class="iconfont" style="color:#e3a50e;">&#xe80a;</text>
                    </view>
                    <button class="fr" style="background: #f0c61e;" @click="$goPage(`c2cDetails/c2cDetails?advertId=${item.advertId}&type=SELL`)">出售</button>
                  </view>
                </view>
              </template>
            </block>
            <uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
          </template>
          <template v-if="type == 'LIST'">
            <view class="c2c_record">
              <view class="c_r_main">
                <view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=BUY&orderType=SELL&user=ordinary')">
                  <view class="fl">购买记录</view>
                  <view class="fr"><uni-icon type="arrowright" :color="'#03bcc0'" size="20"></uni-icon></view>
                </view>
                <view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=SELL&orderType=PURCHASE&user=ordinary')">
                  <view class="fl">出售记录</view>
                  <view class="fr"><uni-icon type="arrowright" :color="'#03bcc0'" size="20"></uni-icon></view>
                </view>
              </view>

              <template v-if="USERINFO.c2cMember == 'INIT'">
                <view class="c_r_main">
                  <view class="c_r_main_item clear" @click="$goPage('c2cAgent/c2cAgent')">
                    <view class="fl">申请成为承兑商</view>
                    <view class="fr"><uni-icon type="arrowright" :color="'#03bcc0'" size="20"></uni-icon></view>
                  </view>
                </view>
              </template>

              <template v-if="USERINFO.c2cMember.indexOf('VIP') > -1">
                <view class="c_r_main c_r_main_title">
                  <view class="c_r_main_item clear"><view class="fl">承兑商权限</view></view>
                </view>
                <view class="c_r_main">
                  <view class="c_r_main_item clear" @click="$goPage('c2cCreated/c2cCreated')">
                    <view class="fl">发布订单</view>
                    <view class="fr"><uni-icon type="arrowright" :color="'#03bcc0'" size="20"></uni-icon></view>
                  </view>
                  <view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=BUY&orderType=PURCHASE&user=member')">
                    <view class="fl">承兑商收购记录</view>
                    <view class="fr"><uni-icon type="arrowright" :color="'#03bcc0'" size="20"></uni-icon></view>
                  </view>
                  <view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=SELL&orderType=SELL&user=member')">
                    <view class="fl">承兑商出售记录</view>
                    <view class="fr"><uni-icon type="arrowright" :color="'#03bcc0'" size="20"></uni-icon></view>
                  </view>
                </view>
              </template>
            </view>
          </template>
        </view>
      </view>
    </scroll-view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import { uniIcon, uniLoadMore } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from './service.js';
import filter from '@/common/filter.js';
import { mapGetters } from 'vuex';
export default {
  components: { uniIcon, HMmessages, uniLoadMore },
  data() {
    return {
      filter,
      type: 'BUY',
      coin: 'USDK',
	  cexchange: [
	  		  {name: "USDK"},
	  ],
      pageNo: 1,
      pageSize: 10,
      list: [],
      loading: true,
      noData: false
    };
  },
  computed: {
    ...mapGetters(['USERINFO','COINCONFIG'])
  },
  onShow() {
    this.pageNo = 1;
    this.list = [];
    this.getList();
  },
  methods: {
    //查询列表
    getList() {
      this.loading = true;
      let param = {
        assetCode: this.coin,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      };
      let name = this.type == 'BUY' ? 'sellAdvertQuery' : 'buyAdvertQuery';
      service[name](param).then(({ data }) => {
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
    //设置币种
    setCoin(type) {
      this.coin = type;
      this.pageNo = 1;
      this.list = [];
      this.getList();
    },
    //设置买入还是卖出
    setType(name) {
      if(name == 'LIST'){
        if(this.$api.isLogin()){
          this.type = name;
          return false
        }
        this.$api.goLogin('../login/login')
      }else{
        this.type = name;
      }
      if (name == 'BUY' || name == 'SELL') {
        this.list = [];
        this.pageNo = 1;
        this.loading = true;
        this.getList();
      }
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
