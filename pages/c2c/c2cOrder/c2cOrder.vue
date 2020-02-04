<template>
  <view class="content">
    <scroll-view style="height: 100%;" scroll-y @scrolltolower="load">
      <view class="c2cOrder">
        <template v-if="c2cTransOrderType == 'BUY'">
          <view class="order_status">
            <button :class="type == 'UNPAY' ? 'active' : ''" @click="setType('UNPAY')">未付款</button>
            <button :class="type == 'PAID' ? 'active' : ''" @click="setType('PAID')">已付款</button>
            <button :class="type == 'COMPLETED' ? 'active' : ''" @click="setType('COMPLETED')">已完成</button>
            <button :class="type == 'COMPLAINNING' ? 'active' : ''" @click="setType('COMPLAINNING')">申诉</button>
          </view>
        </template>
        <template v-else>
          <view class="order_status">
            <button :class="type == 'UNPAY' ? 'active' : ''" @click="setType('UNPAY')">未收款</button>
            <button :class="type == 'PAID' ? 'active' : ''" @click="setType('PAID')">已收款</button>
            <button :class="type == 'COMPLETED' ? 'active' : ''" @click="setType('COMPLETED')">已完成</button>
            <button :class="type == 'COMPLAINNING' ? 'active' : ''" @click="setType('COMPLAINNING')">申诉</button>
          </view>
        </template>
        <view class="c2cOrder_list">
          <template v-if="userType == 'ordinary'">
            <template v-if="region == 'SELL'">
              <view class="c2cOrder_list_item" v-if="list[0]" v-for="(item, index) in list" :key="index">
                <view class="item_orderNum clear">
                  <text class="fl">{{ item.assetCode }} {{ c2cTransOrderType == 'BUY' ? '购买' : '出售' }}</text>
                  <text class="fr">订单号：{{ item.transOrderId }}</text>
                </view>
                <template v-if="type == 'UNPAY'">
                  <view class="item">
                    <text class="fl">剩余时间：</text>
                    <view class="fr" v-if="item.leftDate && item.leftDate > 0">
                      <uni-countdown
                        :show-day="false"
                        :backgroundColor="'transparent'"
                        :borderColor="'transparent'"
                        :splitor-color="'#f0c61e'"
                        :color="'#f0c61e'"
                        :minute="item.Time.split(':')[0] * 1"
                        :second="item.Time.split(':')[1] * 1"
                        @timeup="orderTime(item)"
                      ></uni-countdown>
                      <text style="margin-left: 12upx;">(超时将关闭订单)</text>
                    </view>
                    <view class="fr" v-else style="color: #ec5151;">订单已超时</view>
                  </view>
                </template>
                <view class="item">
                  <text class="fl">交易时间：</text>
                  <text class="fr">{{ $formta(item.createDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item" v-if="type != 'UNPAY' && type != 'COMPLAINNING'">
                  <text class="fl">完成时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item">
                  <text class="fl">卖&emsp;&emsp;家：</text>
                  <text class="fr">{{ item.sellNickname || '*对方未设置昵称' }}</text>
                </view>
                <view class="item">
                  <text class="fl">手&ensp;机&ensp;号：</text>
                  <view class="fr" style="color: #f0c61e;">
                    {{ item.sellPhone || '无' }}
                    <!-- #ifdef H5 -->
                    <text v-if="type == 'UNPAY' || type == 'PAID'" @click="copy(item.sellPhone)" style="color: #03bcc0;float: right;">复制</text>
                    <!-- #endif -->
                    <!-- #ifdef APP-PLUS -->
                    <text v-if="type == 'UNPAY' || type == 'PAID'" @click="contactPhone(item.sellPhone)" style="color: #03bcc0;float: right;">联系对方</text>
                    <!-- #endif -->
                  </view>
                </view>
                <view class="item">
                  <text class="fl">{{ item.dto.c2cPayType === 'BANK' ? '收款账户' : '支&ensp;付&ensp;宝' }}：</text>
                  <template v-if="item.dto.c2cPayType === 'BANK'">
                    <view class="fr" style="color: #f0c61e;">
                      <view>{{ item.dto.bank }} / {{ item.dto.subBank }}</view>
                      <view class="clear">
                        <text style="float: left;">{{ item.dto.name + ' / ' + item.dto.acnumber }}</text>
                        <text v-if="type == 'UNPAY' && c2cTransOrderType == 'BUY'" @click="copy(item.dto.acnumber)" style="color: #03bcc0;float: right;">复制</text>
                      </view>
                    </view>
                  </template>
                  <template v-else>
                    <view class="fr" style="color: #f0c61e;">
                      <view class="clear">
                        <text style="float: left;">{{ item.dto.name }} {{ item.dto.alipayNo ? '| ' + item.dto.alipayNo : '' }}</text>
                        <text v-if="type == 'UNPAY' && c2cTransOrderType == 'BUY'" @click="copy(item.dto.alipayNo)" style="color: #03bcc0;float: right;">复制</text>
                      </view>
                    </view>
                  </template>
                </view>
                <view class="item">
                  <text class="fl">付&ensp;款&ensp;码：</text>
                  <text class="fr">{{ item.payCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">交易价格：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.tradePrice, 2) }}</text>
                    {{ item.currency }}/{{ item.assetCode }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">数&emsp;&emsp;量：</text>
                  <text class="fr">{{ filter.floorFix(item.number, 2) }} {{ item.assetCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">手&ensp;续&ensp;费：</text>
                  <text class="fr">{{ filter.floorFix(item.fee, 2) }} {{ item.assetCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">金&emsp;&emsp;额：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.money, 2) }}</text>
                    {{ item.currency }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">备&emsp;&emsp;注：</text>
                  <text class="fr">{{ item.remark || '无' }}</text>
                </view>
                <view class="item" v-if="type == 'COMPLAINNING'">
                  <text class="fl">申诉时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item_status clear">
                  <template v-if="type == 'UNPAY'">
                    <view class="btn_status">
                      <button class="active" @click="setItem(item, 'isSure')">确认付款</button>
                      <button @click="setItem(item, 'isOrederClose')">取消订单</button>
                    </view>
                  </template>
                  <template v-if="type == 'PAID'">
                    <view class="text_status" :style="{ color: item.status == 'FINISHED' ? '#2eb34b' : item.status == 'CLOSED' ? '#ec5151' : '' }">{{ Text(item.status) }}</view>
                    <view class="btn_status"><button class="active" @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderBuy&type=SELL`)">申诉</button></view>
                  </template>
                  <template v-if="type == 'COMPLETED'">
                    <view class="text_status" :style="{ color: item.status == 'FINISHED' ? '#2eb34b' : item.status == 'CLOSED' ? '#ec5151' : '' }">{{ Text(item.status) }}</view>
                    <!-- <view class="btn_status">
                      <text class="btn_text">有异议？</text>
                      <button @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderBuy&type=SELL`)">申诉</button>
                    </view> -->
                  </template>
                  <template v-if="type == 'COMPLAINNING'">
                    <view class="text_status">{{ Text(item.status) }}</view>
                  </template>
                </view>
              </view>
            </template>

            <template v-if="region == 'PURCHASE'">
              <view class="c2cOrder_list_item" v-if="list[0]" v-for="(item, index) in list" :key="index">
                <view class="item_orderNum clear">
                  <text class="fl">{{ item.assetCode }} {{ c2cTransOrderType == 'BUY' ? '购买' : '出售' }}</text>
                  <text class="fr">订单号：{{ item.transOrderId }}</text>
                </view>
                <template v-if="type == 'UNPAY'">
                  <view class="item">
                    <text class="fl">剩余时间：</text>
                    <view class="fr" v-if="item.leftDate && item.leftDate > 0">
                      <uni-countdown
                        :show-day="false"
                        :backgroundColor="'transparent'"
                        :borderColor="'transparent'"
                        :splitor-color="'#f0c61e'"
                        :color="'#f0c61e'"
                        :minute="item.Time.split(':')[0] * 1"
                        :second="item.Time.split(':')[1] * 1"
                        @timeup="orderTime(item)"
                      ></uni-countdown>
                      <text style="margin-left: 12upx;">(超时将关闭订单)</text>
                    </view>
                    <view class="fr" v-else style="color: #ec5151;">订单已超时</view>
                  </view>
                </template>
                <view class="item">
                  <text class="fl">交易时间：</text>
                  <text class="fr">{{ $formta(item.createDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item" v-if="type != 'UNPAY' && type != 'COMPLAINNING'">
                  <text class="fl">完成时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item">
                  <text class="fl">付&ensp;款&ensp;方：</text>
                  <text class="fr">{{ item.buyNickname }}</text>
                </view>
                <view class="item">
                  <text class="fl">手&ensp;机&ensp;号：</text>
                  <view class="fr" style="color: #f0c61e;">
                    {{ item.buyPhone || '无' }}
                    <!-- #ifdef H5 -->
                    <text v-if="type == 'UNPAY' || type == 'PAID'" @click="copy(item.buyPhone)" style="color: #03bcc0;float: right;">复制</text>
                    <!-- #endif -->
                    <!-- #ifdef APP-PLUS -->
                    <text v-if="type == 'UNPAY' || type == 'PAID'" @click="contactPhone(item.buyPhone)" style="color: #03bcc0;float: right;">联系对方</text>
                    <!-- #endif -->
                  </view>
                </view>
                <view class="item" v-if="item.dto.c2cPayType != 'ALIPAY'">
                  <text class="fl">付款账户：</text>
                  <view class="fr" style="color: #f0c61e;">{{ item.dto.buyCnumber }}</view>
                </view>
                <view class="item">
                  <text class="fl">付款方式：</text>
                  <view class="fr" style="color: #f0c61e;">{{ item.dto.c2cPayType == 'BANK' ? '银行卡' : '支付宝' }}</view>
                </view>
                <view class="item">
                  <text class="fl">卖&emsp;&emsp;家：</text>
                  <text class="fr">{{ item.sellNickname }}</text>
                </view>
                <view class="item">
                  <text class="fl">收款账户：</text>
                  <template v-if="item.dto.c2cPayType === 'BANK'">
                    <view class="fr" style="color: #f0c61e;">
                      <view>{{ item.dto.bank }} / {{ item.dto.subBank }}</view>
                      <view class="clear">
                        <text style="float: left;">{{ item.dto.name + ' / ' + item.dto.acnumber }}</text>
                      </view>
                    </view>
                  </template>
                  <template v-else>
                    <view class="fr" style="color: #f0c61e;">
                      <view>{{ item.dto.name }} {{ item.dto.alipayNo ? '| ' + item.dto.alipayNo : '' }}</view>
                    </view>
                  </template>
                </view>
                <view class="item">
                  <text class="fl">付&ensp;款&ensp;码：</text>
                  <text class="fr">{{ item.payCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">交易价格：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.tradePrice, 2) }}</text>
                    {{ item.currency }}/{{ item.assetCode }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">数&emsp;&emsp;量：</text>
                  <text class="fr">{{ filter.floorFix(item.number, 2) }} {{ item.assetCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">手&ensp;续&ensp;费：</text>
                  <text class="fr">{{ filter.floorFix(item.fee, 2) }} {{ item.assetCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">金&emsp;&emsp;额：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.money, 2) }}</text>
                    {{ item.currency }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">备&emsp;&emsp;注：</text>
                  <text class="fr">{{ item.remark || '无' }}</text>
                </view>
                <view class="item" v-if="type == 'COMPLAINNING'">
                  <text class="fl">申诉时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>

                <template v-if="region == 'SELL'">
                  <view class="item_status clear">
                    <template v-if="type == 'UNPAY'">
                      <view style="height: 53upx;"></view>
                    </template>
                    <template v-if="type == 'PAID'">
                      <view class="text_status">交易成功，等待卖家打币</view>
                      <view class="btn_status"><button class="active" @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderBuy&type=SELL`)">申诉</button></view>
                    </template>
                    <template v-if="type == 'COMPLETED'">
                      <view class="text_status" :style="{ color: item.status == 'FINISHED' ? '#2eb34b' : item.status == 'CLOSED' ? '#ec5151' : '' }">{{ Text(item.status) }}</view>
                      <!-- <view class="btn_status">
                        <text class="btn_text">有异议？</text>
                        <button @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderBuy&type=SELL`)">申诉</button>
                      </view> -->
                    </template>
                    <template v-if="type == 'COMPLAINNING'">
                      <view class="text_status">申诉中</view>
                    </template>
                  </view>
                </template>

                <template v-if="region == 'PURCHASE'">
                  <view class="item_status clear">
                    <template v-if="type == 'UNPAY'">
                      <view style="height: 53upx;"></view>
                    </template>
                    <template v-if="type == 'PAID'">
                      <view class="btn_status">
                        <button class="active" @click="setItem(item, 'isCoin')">确认打币</button>
                        <button @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderSell&type=PURCHASE`)">申诉</button>
                      </view>
                    </template>
                    <template v-if="type == 'COMPLETED'">
                      <view class="text_status" :style="{ color: item.status == 'FINISHED' ? '#2eb34b' : item.status == 'CLOSED' ? '#ec5151' : '' }">{{ Text(item.status) }}</view>
                      <!-- <view class="btn_status">
                        <text class="btn_text">有异议？</text>
                        <button @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderBuy&type=PURCHASE`)">申诉</button>
                      </view> -->
                    </template>
                    <template v-if="type == 'COMPLAINNING'">
                      <view class="text_status">申诉中</view>
                      <view class="btn_status"><button class="active" @click="setItem(item, 'isForce')">强制打币</button></view>
                    </template>
                  </view>
                </template>
              </view>
            </template>
          </template>

          <template v-if="userType == 'member'">
            <template v-if="region == 'SELL'">
              <view class="c2cOrder_list_item" v-if="list[0]" v-for="(item, index) in list" :key="index">
                <view class="item_orderNum clear">
                  <text class="fl">{{ item.assetCode }} {{ c2cTransOrderType == 'BUY' ? '收购' : '出售' }}</text>
                  <text class="fr">订单号：{{ item.transOrderId }}</text>
                </view>
                <template v-if="type == 'UNPAY'">
                  <view class="item">
                    <text class="fl">剩余时间：</text>
                    <view class="fr" v-if="item.leftDate && item.leftDate > 0">
                      <uni-countdown
                        :show-day="false"
                        :backgroundColor="'transparent'"
                        :borderColor="'transparent'"
                        :splitor-color="'#f0c61e'"
                        :color="'#f0c61e'"
                        :minute="item.Time.split(':')[0] * 1"
                        :second="item.Time.split(':')[1] * 1"
                        @timeup="orderTime(item)"
                      ></uni-countdown>
                      <text style="margin-left: 12upx;">(超时将关闭订单)</text>
                    </view>
                    <view class="fr" v-else style="color: #ec5151;">订单已超时</view>
                  </view>
                </template>
                <view class="item">
                  <text class="fl">交易时间：</text>
                  <text class="fr">{{ $formta(item.createDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item" v-if="type != 'UNPAY' && type != 'COMPLAINNING'">
                  <text class="fl">完成时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item">
                  <text class="fl">买&emsp;&emsp;家：</text>
                  <text class="fr">{{ item.buyNickname }}</text>
                </view>
                <view class="item">
                  <text class="fl">手&ensp;机&ensp;号：</text>
                  <text class="fr">{{ item.buyPhone || '无' }}</text>
                </view>
                <view class="item" v-if="item.dto.c2cPayType != 'BANK'">
                  <text class="fl">支&ensp;付&ensp;宝：</text>
                  <text class="fr" style="color: #f0c61e;">{{ item.dto.name }} {{ item.dto.alipayNo ? '| ' + item.dto.alipayNo : '' }}</text>
                </view>
                <view class="item" v-else>
                  <text class="fl">付款账户：</text>
                  <view class="fr" style="color: #f0c61e;">
                    <view>{{ item.dto.buyBank }} / {{ item.dto.buyCnumber }}</view>
                  </view>
                </view>
                <view class="item">
                  <text class="fl">付&ensp;款&ensp;码：</text>
                  <text class="fr">{{ item.payCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">交易价格：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.tradePrice, 2) }}</text>
                    {{ item.currency }}/{{ item.assetCode }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">数&emsp;&emsp;量：</text>
                  <text class="fr">{{ filter.floorFix(item.number, 2) }} {{ item.assetCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">金&emsp;&emsp;额：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.money, 2) }}</text>
                    {{ item.currency }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">备&emsp;&emsp;注：</text>
                  <text class="fr">{{ item.remark || '无' }}</text>
                </view>
                <view class="item" v-if="type == 'COMPLAINNING'">
                  <text class="fl">申诉时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item_status clear">
                  <template v-if="type == 'UNPAY'">
                    <view style="height: 53upx;"></view>
                  </template>
                  <template v-if="type == 'PAID'">
                    <view class="btn_status">
                      <button class="active" @click="setItem(item, 'isCoin')">确认打币</button>
                      <button @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderSell&type=SELL`)">申诉</button>
                    </view>
                  </template>
                  <template v-if="type == 'COMPLETED'">
                    <view class="text_status" :style="{ color: item.status == 'FINISHED' ? '#2eb34b' : item.status == 'CLOSED' ? '#ec5151' : '' }">{{ Text(item.status) }}</view>
                    <!-- <view class="btn_status">
                      <text class="btn_text">有异议？</text>
                      <button>申诉</button>
                    </view> -->
                  </template>
                  <template v-if="type == 'COMPLAINNING'">
                    <view class="text_status">申诉中</view>
                    <view class="btn_status"><button class="active" @click="setItem(item, 'isForce')">强制打币</button></view>
                  </template>
                </view>
              </view>
            </template>

            <template v-if="region == 'PURCHASE'">
              <view class="c2cOrder_list_item" v-if="list[0]" v-for="(item, index) in list" :key="index">
                <view class="item_orderNum clear">
                  <text class="fl">{{ item.assetCode }} {{ c2cTransOrderType == 'BUY' ? '收购' : '出售' }}</text>
                  <text class="fr">订单号：{{ item.transOrderId }}</text>
                </view>
                <template v-if="type == 'UNPAY'">
                  <view class="item">
                    <text class="fl">剩余时间：</text>
                    <view class="fr" v-if="item.leftDate && item.leftDate > 0">
                      <uni-countdown
                        :show-day="false"
                        :backgroundColor="'transparent'"
                        :borderColor="'transparent'"
                        :splitor-color="'#f0c61e'"
                        :color="'#f0c61e'"
                        :minute="item.Time.split(':')[0] * 1"
                        :second="item.Time.split(':')[1] * 1"
                        @timeup="orderTime(item)"
                      ></uni-countdown>
                      <text style="margin-left: 12upx;">(超时将关闭订单)</text>
                    </view>
                    <view class="fr" v-else style="color: #ec5151;">订单已超时</view>
                  </view>
                </template>
                <view class="item">
                  <text class="fl">交易时间：</text>
                  <text class="fr">{{ $formta(item.createDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item" v-if="type != 'UNPAY' && type != 'COMPLAINNING'">
                  <text class="fl">完成时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>
                <view class="item">
                  <text class="fl">收&ensp;款&ensp;方：</text>
                  <text class="fr">{{ item.sellNickname }}</text>
                </view>
                <view class="item">
                  <text class="fl">手&ensp;机&ensp;号：</text>
                  <view class="fr" style="color: #f0c61e;">
                    {{ item.sellPhone || '无' }}
                    <!-- #ifdef H5 -->
                    <text v-if="type == 'UNPAY' || type == 'PAID'" @click="copy(item.sellPhone)" style="color: #03bcc0;float: right;">复制</text>
                    <!-- #endif -->
                    <!-- #ifdef APP-PLUS -->
                    <text v-if="type == 'UNPAY' || type == 'PAID'" @click="contactPhone(item.sellPhone)" style="color: #03bcc0;float: right;">联系对方</text>
                    <!-- #endif -->
                  </view>
                </view>
                <view class="item" v-if="item.dto.c2cPayType != 'BANK'">
                  <text class="fl">支&ensp;付&ensp;宝：</text>
                  <view class="fr" style="color: #f0c61e;">
                    {{ item.dto.name }} {{ item.dto.alipayNo ? '| ' + item.dto.alipayNo : '' }}
                    <text v-if="type == 'UNPAY'" @click="copy(item.dto.alipayNo)" style="color: #03bcc0;float: right;">复制</text>
                  </view>
                </view>
                <view class="item" v-else>
                  <text class="fl">收款账户：</text>
                  <view class="fr" style="color: #f0c61e;">
                    <view>{{ item.dto.bank }} / {{ item.dto.subBank }}</view>
                    <view class="clear">
                      <text style="float: left;">{{ item.dto.name + ' / ' + item.dto.acnumber }}</text>
                      <text v-if="type == 'UNPAY'" @click="copy(item.dto.acnumber)" style="color: #03bcc0;float: right;">复制</text>
                    </view>
                  </view>
                </view>
                <view class="item">
                  <text class="fl">付&ensp;款&ensp;码：</text>
                  <text class="fr">{{ item.payCode }}</text>
                </view>
                <view class="item">
                  <text class="fl">交易价格：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.tradePrice, 2) }}</text>
                    {{ item.currency }}/{{ item.assetCode }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">数&emsp;&emsp;量：</text>
                  <text class="fr">{{ filter.floorFix(item.number, 2) }} {{ item.assetCode }}</text>
                </view>

                <view class="item">
                  <text class="fl">金&emsp;&emsp;额：</text>
                  <text class="fr">
                    <text style="color: #f0c61e; margin-right: 10upx;">{{ filter.floorFix(item.money, 2) }}</text>
                    {{ item.currency }}
                  </text>
                </view>
                <view class="item">
                  <text class="fl">备&emsp;&emsp;注：</text>
                  <text class="fr">{{ item.remark || '无' }}</text>
                </view>
                <view class="item" v-if="type == 'COMPLAINNING'">
                  <text class="fl">申诉时间：</text>
                  <text class="fr">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm:ss') }}</text>
                </view>

                <template v-if="region == 'SELL'">
                  <view class="item_status clear">
                    <template v-if="type == 'UNPAY'">
                      <view style="height: 53upx;"></view>
                    </template>
                    <template v-if="type == 'PAID'">
                      <button class="active" @click="setItem(item, 'isCoin')">确认打币</button>
                      <view class="btn_status"><button class="active" @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderSell&type=SELL`)">申诉</button></view>
                    </template>
                    <template v-if="type == 'COMPLETED'">
                      <view class="text_status" :style="{ color: item.status == 'FINISHED' ? '#2eb34b' : item.status == 'CLOSED' ? '#ec5151' : '' }">{{ Text(item.status) }}</view>
                      <!-- <view class="btn_status">
                        <text class="btn_text">有异议？</text>
                        <button @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderBuy&type=PURCHASE`)">申诉</button>
                      </view> -->
                    </template>
                    <template v-if="type == 'COMPLAINNING'">
                      <view class="text_status">申诉中</view>
                    </template>
                  </view>
                </template>

                <template v-if="region == 'PURCHASE'">
                  <view class="item_status clear">
                    <template v-if="type == 'UNPAY'">
                      <view class="btn_status"><button class="active" @click="setItem(item, 'isSure')">确认付款</button></view>
                    </template>
                    <template v-if="type == 'PAID'">
                      <view class="text_status">交易成功，等待卖家打币</view>
                      <view class="btn_status"><button @click="$goPage(`appeal/appeal?transOrderId=${item.transOrderId}&behalf=orderBuy&type=PURCHASE`)">申诉</button></view>
                    </template>
                    <template v-if="type == 'COMPLETED'">
                      <view class="text_status" :style="{ color: item.status == 'FINISHED' ? '#2eb34b' : item.status == 'CLOSED' ? '#ec5151' : '' }">{{ Text(item.status) }}</view>
                    </template>
                    <template v-if="type == 'COMPLAINNING'">
                      <view class="text_status">申诉中</view>
                    </template>
                  </view>
                </template>
              </view>
            </template>
          </template>
        </view>
      </view>
      <uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
    </scroll-view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
    <!-- 取消订单提醒 -->
    <Modal :title="'取消订单'" v-if="isOrederClose" @close="closeModal('isOrederClose')">
      <view class="common_model">
        <view style="line-height: 40upx; margin-bottom: 20upx; font-size: 28upx; text-indent: 2em;">您每天可取消3次订单，取消订单后，您将无法正常完成购买，确定要取消吗？</view>
        <view class="common_btn">
          <button @click="closeModal('isOrederClose')">取消</button>
          <button class="active" @click="cancel(itemObj)">确定取消订单</button>
        </view>
      </view>
    </Modal>

    <!-- 确认支付 -->
    <Modal :title="'确认支付'" v-if="isSure" @close="closeModal('isSure')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">资金密码:</text>
            <view class="fr"><input type="password" v-model="payPwd" placeholder="请输入资金密码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <button @click="closeModal('isSure')">取消</button>
          <button class="active" @click="sure(itemObj)">确定</button>
        </view>
      </view>
    </Modal>

    <!-- 确定打币 -->
    <Modal :title="'确定打币'" v-if="isCoin" @close="closeModal('isCoin')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">资金密码:</text>
            <view class="fr"><input type="password" v-model="payPwd" placeholder="请输入资金密码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <button @click="closeModal('isCoin')">取消</button>
          <button class="active" @click="confirmTransfer(itemObj)">确定</button>
        </view>
      </view>
    </Modal>

    <!-- 强制打币 -->
    <Modal :title="'强制打币'" v-if="isForce" @close="closeModal('isForce')">
      <view class="common_model">
        <view class="common_foot_tip" style="margin-top: 0;">请确认您已收到买家付款，点击此按钮后系统会将您账户托管的资产划转给买家</view>
        <view class="common_form">
          <view class="item clear">
            <text class="fl">资金密码:</text>
            <view class="fr"><input type="password" v-model="payPwd" placeholder="请输入资金密码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <button @click="closeModal('isForce')">取消</button>
          <button class="active" @click="forceTransforCoin(itemObj)">确定</button>
        </view>
      </view>
    </Modal>
  </view>
</template>

<script>
import uniCountdown from '@/components/uni-countdown/uni-countdown.vue';
import main from './main.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import Modal from '@/components/lkex-modal/index.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
export default {
  components: { uniCountdown, HMmessages, Modal, uniLoadMore },
  mixins: [main]
};
</script>

<style lang="scss">
@import './style.scss';
</style>
