<template>
  <view class="content">
    <!-- #ifdef APP-PLUS -->
    <view class="status_bar"><view class="top_view"></view></view>
    <!-- #endif -->
    <view class="exchange">
      <view class="exchange_header">
        <button :class="pairs == 'optional' ? 'active' : ''" @click="setType('optional')">自选</button>
        <block v-for="(item, index) in cexchange" :key="index">
          <button :class="item.name == pairs ? 'active' : ''" @click="setType(item.name)">{{ item.name }}</button>
        </block>
      </view>
      <view class="exchange_main">
        <view class="exchange_nav">
          <text style="min-width: 288upx;">币种</text>
          <text style="min-width: 179upx;">最新价格</text>
          <text style="min-width: 127upx;">涨跌</text>
          <text style="text-align: right;">自选</text>
        </view>
        <view class="exchange_list">
          <view
            class="item"
            v-for="(item, index) in list"
            :key="index"
			v-if="item.SHOWSTATUS&&item.status !='INIT'"
            @click="$goPage(`quotation/quotation?type=${item.symbol}&title=${item.title}&coin=${item.assetCode1}&symbol=${item.assetCode2}`)"
          >
            <view class="flex" style="min-width: 288upx;">
			  <image class="icon-cion" :src="'../../static/coin/' + item.assetCode2.toLowerCase() + '@2x.png'"></image>
              <view class="item_coin">
                <text>{{ item.title }}</text>
                <text style="font-size: 22upx;;">24h量：{{ filter.fix(item.trade ? item.trade['24Total'] : 0, 4) | lockNum }}</text>
              </view>
            </view>
            <view class="flex price" style="min-width: 179upx;">
              <text class="new">{{ filter.fix(item.trade ? item.trade.newPrice : 0, 4) }}</text>
              <text class="money" v-if="tether">
                ￥{{
                  filter.fix((item.trade ? item.trade.newPrice : 0) * (item.assetCode1 == 'USDT' ? tether : item.assetCode1 == 'BTC' ? bitcoin : item.assetCode1 == 'ETH' ? ethereum : item.assetCode1 == 'DUSD' ? digitalusd : 6.58), 4)
                }}
              </text>
            </view>
            <view class="flex gain">
              <text :class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']">{{ (item.trade ? item.trade.changeRatio : 0) }}%</text>
            </view>
            <view class="flex optional" @click.stop="startSymbol(item.symbol)">
              <text v-if="userStart.includes(item.symbol)" class="iconfont">&#xe658;</text>
              <text v-else class="iconfont">&#xe657;</text>
            </view>
          </view>
		  <view
		    class="item"
		    v-for="(item, index) in list"
		    :key="index"
		  	v-if="item.SHOWSTATUS&&item.status ==='INIT'"
		  >
		    <view class="flex" style="min-width: 288upx;">
		  			  <image class="icon-cion" :src="'../../static/coin/' + item.assetCode2.toLowerCase() + '@2x.png'"></image>
		      <view class="item_coin">
		        <text>{{ item.title }}</text>
		        <text style="font-size: 22upx;;">24h量：--</text>
		      </view>
		    </view>
		    <view class="flex price" style="min-width: 179upx;">
		      <text class="new">--</text>
		      <text class="money" v-if="tether">
		        ￥--
		      </text>
		    </view>
		    <view class="flex gain">
		      <text :class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']">--%</text>
		    </view>
		    <view class="flex optional" @click.stop="startSymbol(item.symbol)">
		      <text v-if="userStart.includes(item.symbol)" class="iconfont">&#xe658;</text>
		      <text v-else class="iconfont">&#xe657;</text>
		    </view>
		  </view>
          <uni-load-more v-if="!list[0]" :status="loading ? 'loading' : !list[0] ? 'noMore' : ''"></uni-load-more>
        </view>
      </view>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
  </view>
</template>

<script>
import main from './main.js';
import { uniLoadMore } from '@dcloudio/uni-ui';
import { mapGetters } from 'vuex';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
export default {
  components: {
    uniLoadMore,
    HMmessages
  },
  computed: {
    ...mapGetters(['COINRMB','EXCHANGE','COINCONFIG'])
  },
  mixins: [main]
};
</script>

<style lang="scss">
@import './style.scss';
</style>
