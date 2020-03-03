<template>
  <view class="content">
    <!-- #ifdef APP-PLUS -->
    <view class="status_bar">
      <view class="top_view"></view>
    </view>
    <!-- #endif -->
    <view class="quotation">
      <view class="quotation_NavBar">
        <view class="back" @click="back()">
		 <uni-icons type="back" :color="'#fff'" style="margin-left: -40upx;"></uni-icons>
        </view>
        <view class="select_coin">
          <view class="select_coin_main" @click="showSelect = true">
            <text>{{ title }}</text>
            <uni-icons type="arrowdown" :size="12" :color="'#488fd3'"></uni-icons>
          </view>
        </view>
        <view class="quotation_kline" @click="goKline()">
          <text style="font-size: 22upx;;">K线</text>
          <text class="iconfont">&#xe62a;</text>
        </view>
      </view>
      <view class="quotation_nav">
        <button :class="type == 'BUY' ? 'active' : ''" @click="setType('BUY')">买入</button>
        <button :class="type == 'SELL' ? 'active' : ''" @click="setType('SELL')">卖出</button>
        <button :class="type == 'CURRENT' ? 'active' : ''" @click="setType('CURRENT')">当前委托</button>
        <button :class="type == 'HISTORY' ? 'active' : ''" @click="setType('HISTORY')">历史委托</button>
      </view>
      <template v-if="type == 'BUY' || type == 'SELL'">
        <view class="quotation_pan">
          <view class="quotation_pan_main clear">
            <view class="pan_left" :class="type == 'BUY' ? 'max_min_buy' : 'max_min_sell'">
              <text class="p_l_title">限价单</text>
              <text class="p_l_surplus">剩余</text>
              <text class="p_l_surplus_money">{{ filter.fix(money, 6) }} {{ type == 'BUY' ? coin : symbol }}</text>
              <view class="pan_buy_sell">
                <view class="item clear">
                  <input class="input" v-model="price" :maxlength="priceMaxLength" type="digit" placeholder="价格" />
                  <text class="coin">{{ coin }}</text>
                </view>
                <view class="item clear">
                  <input class="input" v-model="number" :maxlength="numberMaxLength" type="digit" placeholder="数量" />
                  <text class="coin">{{ symbol }}</text>
                </view>
                <view class="percentage">
                  <button @click="percentage(25)">25%</button>
                  <button @click="percentage(50)">50%</button>
                  <button @click="percentage(75)">75%</button>
                  <button @click="percentage(100)">100%</button>
                </view>
                <view class="max_min clear">
                  <text class="fl">最大可{{ type == 'BUY' ? '买' : '卖' }}</text>
                  <text v-if="type == 'BUY'" class="fr">{{ filter.fix(maxNumber, 6) }} {{ symbol }}</text>
                  <text v-else class="fr">{{ filter.fix(money, 6) }} {{ symbol }}</text>
                </view>
                <view class="max_min clear">
                  <text class="fl">价格</text>
                  <text class="fr">{{ filter.fix( filter.fix(number, 6) * maxPrice, 6) }} {{ coin }}</text>
                </view>
                <view class="submits">
                  <template v-if="isLogin">
                    <button v-if="type == 'BUY'" class="buy" @click="buySell('BUY', false)">买入</button>
                    <button v-if="type == 'SELL'" class="sell" @click="buySell('SELL', false)">卖出</button>
                  </template>
                  <template v-else>
                    <button v-if="type == 'BUY'" @click="$api.goLogin('../../login/login')">买入</button>
                    <button v-if="type == 'SELL'" @click="$api.goLogin('../../login/login')">卖出</button>
                  </template>
                </view>
                <view class="tpis" v-if="!isLogin">请登录后进行买卖</view>
              </view>
            </view>
            <view class="pan_right">
              <view class="p_r_title clear">
                <text class="fl">价格({{ coin }})</text>
                <text class="fr">数量({{ symbol }})</text>
              </view>
              <scroll-view :scroll-top="sellScrollTop" class="pan_sell_list" scroll-y :scroll-with-animation="true" :scroll-into-view="lastName">
                <view id="SELLLIST">
                  <view class="item clear" v-if="sellList[0]" v-for="(item, index) in sellList" :key="index" @click="setPrice(item.price)">
                    <text class="fl">{{ filter.fix(item.price, 6) }}</text>
                    <text class="fr">{{ filter.fix(item.count, 6) }}</text>
                    <text class="bg" :style="{width:item.width}"></text>
                  </view>
                </view>
              </scroll-view>
              <view class="average clear" @click="setPrice(average)">
                <text class="fl">{{ filter.fix(average, 6) }}</text>
                <text class="fr">
                  <text style="font-size: 22upx;;">￥</text>
                  {{ filter.fix(average * (coin == 'USDT' ? COINRMB.tether : coin == 'BTC' ? COINRMB.bitcoin : coin == 'ETH' ? COINRMB.ethereum : coin == 'DUSD' ? COINRMB.digitalusd : 6.58), 2) }}
                </text>
              </view>
              <scroll-view class="pan_buy_list" :scroll-top="buyScrollTop" scroll-y :scroll-with-animation="true">
                <view class="item clear" v-if="buyList[0]" v-for="(item, index) in buyList" :key="index" @click="setPrice(item.price)">
                  <text class="fl">{{ filter.fix(item.price, 6) }}</text>
                  <text class="fr">{{ filter.fix(item.count, 6) }}</text>
                  <text class="bg" :style="{width:item.width}"></text>
                </view>
              </scroll-view>
            </view>
          </view>
          <view class="quotation_pan_new">
            <view class="title">最新成交</view>
            <view class="new_nav">
              <text>价格</text>
              <text>数量</text>
              <text>时间</text>
            </view>
            <view class="new_list">
              <view class="item" v-for="(item, index) in tradeList" :key="index" @click="setPrice(item.price)">
                <text :class="item.type == 'BUY' ? 'buy' : 'sell'">{{ filter.fix(item.price, 6) }}</text>
                <text>{{ filter.fix(item.num, 4) }}</text>
                <text>{{ $formta(item.time * 1000, 'hh:mm:ss') }}</text>
              </view>
              <uni-load-more v-if="!tradeList[0]" status="noMore"></uni-load-more>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <scroll-view scroll-y class="entrust" @scrolltolower="load">
          <view class="entrust_main">
            <view class="select_time">
              <view class="start_time">
                <picker mode="date" :value="startDate" @change="bindDateChange($event, 'startDate')">
                  <view class="uni-input">开始日期：{{ startDate }}</view>
                </picker>
              </view>
              <text class="division">-</text>
              <view class="end_time">
                <picker mode="date" :value="endDate" @change="bindDateChange($event, 'endDate')">
                  <view class="uni-input">结束日期：{{ endDate }}</view>
                </picker>
              </view>
            </view>
            <view class="entrust_main_list">
              <view class="item" v-for="(item, index) in entrustList" :key="index">
                <view class="item_title clear">
                  <text class="fl sell" v-if="item.tradeCoinType == 'SELL'">卖出</text>
                  <text class="fl buy" v-else>买入</text>
                  <button class="fr" v-if="type == 'CURRENT'" @click="cancelOrder(item)">取消</button>
                </view>
                <view class="item_item">
                  <view class="left">
                    <text>委托数量</text>
                    <text>
                      <text style="color: #acaeb1;">{{ filter.fix(item.number, 6) }}</text>
                      {{ ' ' + item.coin }}
                    </text>
                  </view>
                  <view class="right">
                    <text>已成交数量</text>
                    <text>
                      <text style="color: #acaeb1;">{{ filter.fix(item.tradedNumber, 6) }}</text>
                      {{ ' ' + item.coin }}
                    </text>
                  </view>
                </view>
                <view class="item_item">
                  <view class="left">
                    <text>委托价格</text>
                    <text>
                      <text style="color: #acaeb1;">{{ filter.fix(item.price, 6) }}</text>
                      {{ ' ' + coin }}
                    </text>
                  </view>
                  <view class="right">
                    <text>总成交额</text>
                    <text>
                      <text style="color: #acaeb1;">{{ filter.fix(item.matchedMoney, 6) }}</text>
                      {{ ' ' + coin }}
                    </text>
                  </view>
                </view>
                <view class="time clear">
                  <text class="fl">{{ statesTex[item.tradeCoinStatus] }}</text>
                  <text class="fr">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
              </view>
            </view>
          </view>
          <uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
        </scroll-view>
      </template>
      <uni-popup :show="showSelect" position="middle" :h5-top="true" mode="fixed" @hidePopup="hidePopup()">
        <view class="quotation_select">
          <!-- <view class="s_header">
            <view class="left">
              <uni-icons type="search" :color="'#03bcc0'"></uni-icons>
              <input type="text" placeholder="交易对查询" />
            </view>
            <button class="right">取消</button>
          </view> -->
          <view class="s_nav">
            <block v-for="(item, index) in cexchange" :key="index">
              <button :class="item.name == pairs ? 'active' : ''" @click="setCoin(item.name)">{{ item.name }}</button>
            </block>
          </view>
          <view class="s_list clear">
            <block v-for="(item, index) in coinList" :key="index">
              <view class="fl" @click="goPage(`/pages/exchange/quotation/quotation?type=${item.symbol}&title=${item.title}&coin=${item.assetCode1}&symbol=${item.assetCode2}`)">
                <image class="icon-cion" :src="'../../../static/coin/' + item.assetCode2.toLowerCase() + '@2x.png'"></image>
                <text>{{ item.title }}</text>
              </view>
            </block>
            <uni-load-more v-if="!coinList[0]" status="noMore"></uni-load-more>
          </view>
        </view>
      </uni-popup>
    </view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>

    <!-- 输入资金密码 -->
    <Modal :title="'输入资金密码'" v-if="isPayPwd" @close="closeModal('isPayPwd')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">资金密码:</text>
            <view class="fr"><input type="password" v-model="payPwd" placeholder="请输入资金密码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <button @click="closeModal('isPayPwd')">取消</button>
          <button class="active" @click="buySell(isPayPwd, true)">确定</button>
        </view>
      </view>
    </Modal>
  </view>
</template>
<script>
  import main from './main.js';
  import Modal from '@/components/lkex-modal/index.vue';
  import {
    uniIcon,
    uniPopup,
    uniLoadMore
  } from '@dcloudio/uni-ui';
  import uniIcons from "@/components/uni-icon/uni-icon.vue"
  import HMmessages from '@/components/HM-messages/HM-messages.vue';
  import {
    mapGetters
  } from 'vuex';

  export default {
    components: {
      uniIcon,
	  uniIcons,
      uniPopup,
      HMmessages,
      Modal,
      uniLoadMore
    },
    computed: {
      ...mapGetters(['COINRMB', 'USERINFO', 'AVOID', 'PAN','COINCONFIG'])
    },
    mixins: [main]
  };
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
