<template>
	<view class="content">
		<view class="createdDetailed">
			<view class="created_nav">
				<button :class="type == 'SELL' ? 'active' : ''" @click="type = 'SELL'">出售展示</button>
				<button :class="type == 'BUY' ? 'active' : ''" @click="type = 'BUY'">收购展示</button>
			</view>
			<view class="createdDetailed_form">
				<view class="form_nav">
					<block v-for="(item, index) in assetcodeList" :key="index">
						<button :class="coin == item ? 'active' : ''" @click="setCoin(item)">{{ item }}</button>
					</block>
				</view>
				<view class="item clear">
					<text class="fl">国家地区：</text>
					<view class="fr">
						<picker @change="setCity" :value="value" :range="cityList" :range-key="'country'">
							<view class="uni-input">{{ cityList[value] ? cityList[value].country : '' }}</view>
						</picker>
						<view class="downs"><uni-icons type="arrowdown" size="20" :color="'#03bcc0'"></uni-icons></view>
					</view>
				</view>
				<view class="item clear">
					<text class="fl">货&emsp;&emsp;币：</text>
					<text class="fr">{{ currency }}</text>
				</view>
				<view class="item clear" style="margin-bottom: 0;">
					<text class="fl">交易价格：</text>
					<view class="fr">
						<input class="input" v-model="price" :maxlength="priceMaxLength" style="width: calc(100% - 94upx);" type="digit" placeholder="请输入交易价格" />
						<text class="coin">{{ currency }}</text>
					</view>
				</view>
				<view class="tpis clear">
					<text class="fr" v-if="type == 'SELL'">市场参考价：{{ filter.fix(feePrice, 2) }} {{ currency }}</text>
					<text class="fr" v-if="type == 'BUY'">市场参考价：{{ filter.fix(feePrice*0.99, 2) }} {{ currency }}</text>
				</view>
				<view class="item clear">
					<text class="fl">最小个数：</text>
					<view class="fr"><input class="input" :maxlength="minNumberMaxLength" v-model="minNumber" type="digit" placeholder="请输入单笔最小个数" /></view>
				</view>

				<template v-if="type == 'SELL'">
					<view class="item clear" style="margin-bottom: 0;">
						<text class="fl">出售数量：</text>
						<view class="fr"><input class="input" :maxlength="maxNumberMaxLength" v-model="maxNumber" type="digit" placeholder="请输入出售数量" /></view>
					</view>
					<view class="tpis clear">
						<text class="fr">资产余额：{{ filter.fix(money, 6) }} {{ coin }}</text>
					</view>
				</template>

				<template v-else>
					<view class="item clear">
						<text class="fl">收购数量：</text>
						<view class="fr"><input class="input" :maxlength="maxNumberMaxLength" v-model="maxNumber" type="digit" placeholder="请输入收购数量" /></view>
					</view>
				</template>

				<template v-if="type == 'SELL'">
					<view class="item clear payType" style="margin-bottom: 10upx;">
						<text class="fl">收款方式：</text>
						<view class="fr">
							<template v-if="ALIPAY.noPay">
								<view class="pay_alipay" @click.stop="setPay('ALIPAY')">
									<view class="checkbox"><uni-icons v-if="payType.ALIPAY" type="checkmarkempty" :color="'#fff'"></uni-icons></view>
									<text>支付宝</text>
									<text>{{ c2cInfo.ALIPAY.name }} / {{ filter.getSuffixPhone(c2cInfo.ALIPAY.alipayNo) }}</text>
								</view>
							</template>
							<template v-else>
								<view style="color: #f0c61e; text-decoration: underline;" @click="$goPage('../../../account/securitySetting/securitySetting')">
									设置支付宝收款方式
								</view>
							</template>
							<template v-if="BANK.noPay">
								<view class="pay_bank" @click.stop="setPay('BANK')">
									<view class="checkbox"><uni-icons v-if="payType.BANK" type="checkmarkempty" :color="'#fff'"></uni-icons></view>
									<text>银行卡</text>
									<text>{{ c2cInfo.BANK.bank }} / {{ filter.getSuffixBank(c2cInfo.BANK.acnumber) }}</text>
								</view>
							</template>
							<template v-else>
								<view style="color: #f0c61e; text-decoration: underline;" @click="$goPage('../../../account/securitySetting/securitySetting')">
									设置银行卡收款方式
								</view>
							</template>
						</view>
					</view>
				</template>

				<!-- <template v-else>
          <view class="item clear payType">
            <text class="fl">付款方式：</text>
            <view class="fr">
              <view class="pay_alipay fl" @click.stop="setPay('ALIPAY')">
                <view class="checkbox"><uni-icons v-if="payType.ALIPAY" type="checkmarkempty" :color="'#fff'"></uni-icons></view>
                <text>支付宝</text>
              </view>
              <view class="pay_bank fl" style="margin-left: 65upx;" @click.stop="setPay('BANK')">
                <view class="checkbox"><uni-icons v-if="payType.BANK" type="checkmarkempty" :color="'#fff'"></uni-icons></view>
                <text>银行卡</text>
              </view>
            </view>
          </view>
        </template> -->

				<view class="item clear">
					<text class="fl">备注信息：</text>
					<view class="fr" style="line-height: 1.8; height: 92upx; padding: 10upx 20upx;">
						<textarea style="font-size: 26upx;;" v-model="remark" placeholder="可在备注信息中填写您对买方的要求，如在线 时间等（选填）" />
					</view>
				</view>
				<view class="item clear" style="margin-bottom: 24upx;">
					<text class="fl">资金密码：</text>
					<view class="fr"><input class="input" v-model="payPwd" type="password" placeholder="请输入资金密码" /></view>
				</view>
			</view>
			<view class="submits"><button @click="submits()">确认发布</button></view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import filter from '@/common/filter.js';
import { mapGetters } from 'vuex';
import service from '../../service.js';
import comSvc from '@/common/comSvc.js';
export default {
	components: { uniIcon, HMmessages, uniIcons },
	data() {
		return {
			filter,
			type: 'SELL', //SELL,BUY
			coin: 'UDC',
			money: 0,
			assets: [],
			value: 0,
			cityList: [],
			payType: {
				ALIPAY: false,
				BANK: false
			},
			assetcodeList: [],
			countryList: [],
			country: '',
			currency: '',
			marketPrice: '',
			price: '',
			minNumber: '',
			maxNumber: '',
			payPwd: '',
			remark: '',
			feePrice: 0,
			ALIPAY: {
				noPay: true
			},
			BANK: {
				noPay: true
			},
			c2cInfo: {
				ALIPAY: {},
				BANK: {}
			},
			priceMaxLength: -1,
			minNumberMaxLength: -1,
			maxNumberMaxLength: -1
		};
	},
	computed: {
		...mapGetters(['COINRMB'])
	},
	onLoad(option) {
		if (option && option.type) {
			this.type = option.type;
		}
	},
	onShow() {
		if (this.$api.isLogin()) {
			this.getInfo();
			this.getAsset();
			this.getC2cPayInfo();
			this.getTrade();
			return false;
		}
		this.$api.goLogin('../../../login/login');
	},
	watch: {
		price(val) {
			if (val) {
				this.setMaxLength('price', val, 'priceMaxLength');
			}
		},
		minNumber(val) {
			if (val) {
				this.setMaxLength('minNumber', val, 'minNumberMaxLength');
			}
		},
		maxNumber(val) {
			if (val) {
				this.setMaxLength('maxNumber', val, 'maxNumberMaxLength');
			}
		}
	},
	methods: {
		//确定发布订单
		submits() {
			if (!this.veif()) {
				return false;
			}
			let param = {
				assetcode: this.coin,
				country: this.country,
				currency: this.currency,
				tradePrice: this.price,
				remark: this.remark
			};
			let name = 'createAdBuy';
			if (this.type == 'SELL') {
				let arrPay = [];
				if (this.payType.ALIPAY) {
					arrPay.push('ALIPAY');
				}
				if (this.payType.BANK) {
					arrPay.push('BANK');
				}
				param.payType = arrPay;
				param.minAmount = this.minNumber;
				param.maxAmount = this.maxNumber;
				name = 'createAdSell';
			} else {
				param.purchaseMax = this.maxNumber;
				param.purchaseMin = this.minNumber;
			}
			let header = {
				'pay-password': this.payPwd
			};
			this.$api.showLoading();
			let that = this;
			service[name](param, header).then(({ data }) => {
				this.$api.hideLoading();
				if (data.code == '100200') {
					this.HMmessages.show('发布订单成功', {
						textAlign: 'center',
						background: '#356e36',
						fontColor: '#fff',
						callback: () => {
							that.back();
						}
					});
				} else {
					this.errors(data.msg);
				}
			});
		},
		//获取币对
		getTrade() {
			comSvc.getTrade().then(data => {
				this.feePrice = data.data['USDT_USDK'].newPrice * this.COINRMB.tether;
			});
		},
		//获取用户资产
		getAsset() {
			comSvc.getAssets().then(({ data }) => {
				if (data.code == '100200') {
					this.asset = data.data;
					this.asset.map((e, i) => {
						if (e.assetCode == this.coin) {
							this.money = e.amountAvailable;
						}
					});
				} else {
					this.errors(data.msg);
				}
			});
		},
		//设置小数点位数长度
		setMaxLength(name, val, maxName) {
			let precision = 2;
			let arrs = val.split('.');
			let attr0 = arrs[0];
			let attr1 = arrs[1];
			if (attr1) {
				this[name] = attr0 + '.' + attr1.slice(0, precision);
				this[maxName] = attr1.slice(0, precision).length == 2 ? this[name].length : -1;
			} else {
				this[maxName] = -1;
			}
		},
		//查询C2C支付绑定
		getC2cPayInfo() {
			service.getC2cPayInfo().then(({ data }) => {
				if (data.code == '100200') {
					for (let i of data.data) {
						this.c2cInfo[i.c2cPayType] = i;
					}
					this.ALIPAY.noPay = this.c2cInfo.ALIPAY.alipayNo ? true : false;
					this.BANK.noPay = this.c2cInfo.BANK.acnumber ? true : false;
				} else {
					this.errors(data.msg);
				}
			});
		},
		//获取发布基本信息
		getInfo() {
			let name = this.type == 'SELL' ? 'getSellInfo' : 'getBuyInfo';
			service[name]().then(({ data }) => {
				if (data.code == '100200') {
					this.assetcodeList = data.data.assetcodeList;
					this.coin = this.assetcodeList[0] || 'UDC';
					this.cityList = data.data.countryList;
					this.country = this.cityList[0].country;
					this.currency = this.cityList[0].moneyName.toUpperCase();
					if (this.coin == 'USDT') {
						this.marketPrice = this.COINRMB.tether;
					} else if (this.coin == 'DUSD') {
						this.marketPrice = this.COINRMB.digitalusd;
					} else {
						this.marketPrice = this.cityList[0].exRate;
					}
				} else {
					this.errors(data.msg);
				}
			});
		},
		//设置计价币种
		setCoin(item) {
			this.coin = item;
			this.asset.map((e, i) => {
				if (e.assetCode == this.coin) {
					this.money = e.amountAvailable;
				}
			});
			if (this.coin == 'USDT') {
				this.marketPrice = this.COINRMB.tether;
			} else if (this.coin == 'DUSD') {
				this.marketPrice = this.COINRMB.digitalusd;
			} else {
				this.marketPrice = this.cityList[this.value].exRate;
			}
		},
		//设置交易方式
		setPay(name) {
			this.payType[name] = !this.payType[name];
		},
		//设置货币类型
		setCity(e) {
			this.value = e.target.value;
			this.currency = this.cityList[this.value].moneyName.toUpperCase();
			if (this.coin == 'USDT' && this.cityList[this.value].moneyName == 'CNY') {
				this.marketPrice = this.COINRMB.tether;
			} else if (this.coin == 'DUSD' && this.cityList[this.value].moneyName == 'CNY') {
				this.marketPrice = this.COINRMB.digitalusd;
			} else {
				this.marketPrice = this.cityList[this.value].exRate;
			}
		},
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		//验证信息
		veif() {
			if (!this.price) {
				this.errors('请输入交易价格');
				return false;
			}
			if (!this.minNumber || this.minNumber * 1 < 0) {
				this.errors('请输入单笔最低数量');
				return false;
			}
			if (this.type == 'SELL') {
				if (!this.maxNumber || this.maxNumber * 1 < 0) {
					this.errors('请输入出售数量');
					return false;
				}
				if (this.maxNumber * 1 > this.money * 1) {
					this.errors('资产余额不足');
					return false;
				}
				if (!this.payType.ALIPAY && !this.payType.BANK) {
					this.errors('请选择支付方式');
					return false;
				}
			} else {
				if (!this.maxNumber || this.maxNumber * 1 < 0) {
					this.errors('请输入收购数量');
					return false;
				}
			}
			if (this.maxNumber * 1 < this.minNumber * 1) {
				this.errors('出售数量不允许小于最低数量');
				return false;
			}
			if (!this.payPwd) {
				this.errors('请输入资金密码');
				return false;
			}
			return true;
		},
		//修改手机返回
		back() {
			let length = getCurrentPages();
			if (length.length == 1) {
				uni.switchTab({
					url: '../../c2c'
				});
			} else {
				uni.navigateBack();
			}
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
