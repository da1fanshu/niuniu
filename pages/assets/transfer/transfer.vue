<template>
	<view class="content">
		<view class="transfer">
			<view class="transfer_nav">
				<view class="t_left">
					<text>从</text>
					<text class="circle">.........</text>
					<text>到</text>
				</view>
				<view class="t_center">
					<view class="c_top" @click="showAccount('out')">
						<text>{{out}}</text>
						<uni-icons type="arrowright" size="20" :color="'#03bcc0'"></uni-icons>
					</view>
					<view class="c_border"></view>
					<view class="c_bottom" @click="showAccount('enter')">
						<text>{{enter}}</text>
						<uni-icons type="arrowright" size="20" :color="'#03bcc0'"></uni-icons>
					</view>
				</view>
				<image @click="transTo()" src="../../../static/trans.png" mode=""></image>
			</view>
			<view class="transfer_nav">
				<view class="t_center" style="width: 100%;">
					<view class="c_top"  @click="showAccount('coin')">
						<view class="">
							<text style="color: #A3A3A3;">币种选择</text>
							<text style="margin-left: 24rpx;">{{coin}}</text>
						</view>		
						<uni-icons type="arrowright" size="20" :color="'#03bcc0'"></uni-icons>
					</view>
					<view class="c_border" style="width: 100%;"></view>
					<view class="c_input">
						<text style="color: #A3A3A3;">划转数量</text>
						<input v-model="transQuantity" type="number"/>
					</view>
				</view>
			</view>
			<view class="btm">
				<view class="">
					<text style="color:#A3A3A3">最多可划转：</text>
					<text>{{place}}BTC</text>
				</view>
				<text @click="allTo()" style="color:#488FD3;">全部</text>
			</view>
			<view class="submits"><button @click="tranfer()">确认转出</button></view>
			<uni-popup :show="showList" position="bottom" mode="fixed" @hidePopup="hidePopup()">
				<view class="transfer_select">
					<view class="item title" >{{title}}</view>
					<view v-if="name=='out'" v-for="(item,index) in outList" :key="index" class="item" @click="setAccount('out',item)">{{item}}</view>
					<view v-if="name=='enter'" v-for="(item,index) in enterList" :key="index" class="item" @click="setAccount('enter',item)">{{item}}</view>
					<view v-if="name=='coin'" v-for="(item,index) in coinList" :key="index" class="item" @click="setAccount('coin',item)">{{item}}</view>
					<view class="item" @click="hidePopup()">取消</view>
				</view>
			</uni-popup>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { uniPopup } from '@dcloudio/uni-ui';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from '../service.js';
import comSvc from '@/common/comSvc.js';
export default {
	components: {
		uniPopup,
		HMmessages,
		uniIcons
	},
	data() {
		return {
			showList: false,
			number: 0,
			coin: 'USDK',
			place: '',
			transQuantity: '',
			pwd: '',
			out: '资金账户',
			enter: '币币账户',
			title: '',
			name : '',
			outList: ['资金账户','币币账户'],
			enterList: ['资金账户','币币账户'],
			coinList: ['USDT','BTC'],
		};
	},
	onShow() {
		comSvc.getAssets().then(({ data }) => {
			if (data.code == '100200') {
				for (let i = 0; i < data.data.length; i++) {
					if (data.data[i].assetCode == 'USDK') {
						this.number = data.data[i].amountAvailable;
						this.place = '可用：' + data.data[i].amountAvailable;
					}
				}
			}
		});
	},
	onBackPress() {
		if (this.showList !== false) {
			this.showList = false;
			return true;
		}
	},
	methods: {
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		//设置划转账户
		setAccount(name,item) {
			if(this.name == 'out') {
				this.out = item;
			}
			else if(this.name == 'enter') {
				this.enter = item;
			} else {
				this.coin = item
			}
			this.showList = false;
		},
		//转换
		transTo() {
			[this.out,this.enter] = [this.enter,this.out]
		},
		//弹出
		showAccount(name) {
			this.name = name;
			if(name == 'out' || name == 'enter') {
				this.title = '选择账户';
			}
			if(name == 'coin') {
				this.title = '选择币种';
			}
			this.showList = true;
		},
		hidePopup() {
			this.showList = false;
		},
		allTo() {
			this.transQuantity = this.number;
		},
		tranfer() {
			if (!this.transQuantity) {
				this.errors('请输入划转数量');
				return false;
			}
			let param = {
				assetCode: this.coin,
				transQuantity: this.transQuantity
			};
			console.log(this.pwd);
			service
				.assetToCloud(param, {
					'pay-password': this.pwd
				})
				.then(({ data }) => {
					this.aloading = false;
					if (data.code == '100200') {
						this.HMmessages.show('划转成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/assets/assets'
							});
						}, 1500);
					} else {
						this.errors(data.msg);
					}
				});
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
