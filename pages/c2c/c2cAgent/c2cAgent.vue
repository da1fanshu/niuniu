<template>
	<view class="content">
		<!-- user.applyFlag == 'INITING' -->
		<view class="b_bg" v-if="user.applyFlag == 'INITING'"></view>
		<view class="c_bg" v-if="user.applyFlag.indexOf('VIP') > -1"></view>
		<view class="c2cAgent">
			<template v-if="user.applyFlag == 'INIT'">
				<view class="agent_NavBar">
					<view class="back" @click="back()"><uni-icons type="back" :color="'#000'" size="22" style="margin-left: -40upx;"></uni-icons></view>
					<view class="title">申请商家</view>
				</view>
				<view class="gvip">
					<view class="status">
						<image src="../../../static/c2c/vipg.png" mode=""></image>
						<view>vip 1</view>
					</view>
				</view>
			</template>
			<!-- user.applyFlag == 'INITING' -->
			<template v-if="user.applyFlag == 'INITING'">
				<view class="agent_NavBar">
					<view class="back" @click="back()"><uni-icons type="back" :color="'#fff'" size="22" style="margin-left: -40upx;"></uni-icons></view>
					<view class="title">申请商家</view>
				</view>
				<view class="cir">
					<view class="status">
						<image src="../../../static/c2c/shenh.png" mode=""></image>
						<text>审核中</text>
					</view>
				</view>
			</template>
			<template v-if="user.applyFlag.indexOf('VIP') > -1">
				<view class="agent_NavBar">
					<view class="back" @click="back()"><uni-icons type="back" :color="'#fff'" size="22" style="margin-left: -40upx;"></uni-icons></view>
					<view class="title" style="color: #fff;">商家中心</view>
				</view>
				<text class="vip">VIP</text>
			</template>
			<!-- <view class="c2cAgent_isVip">
        <text class="iconfont" style="color: #03bcbf;">&#xe73b;</text>
        <view class="text">
          售卖区：可发布广告为
          <text>{{ VIP1.sellAdLimitNum }}</text>
          个，单笔上限交易为
          <text>{{ VIP1.sellAdLimitCoinNum }}</text>
        </view>
        <view class="text">
          收购区：可发布广告为
          <text>{{ VIP1.buyAdLimitNum }}</text>
          个，单笔上限交易为
          <text>{{ VIP1.buyAdLimitCoinNum }}</text>
        </view>
      </view> -->
	  <!-- user.applyFlag == 'INIT' -->
			<template v-if="user.applyFlag == 'INIT'">
				<view class="u_title">
					<image src="../../../static/c2c/t_bg.png" mode=""></image>
					<text>申请商家</text>	
				</view>
				<view class="c2cAgent_Apply_main">
					<view class="item clear">
						<text>申请等级：</text>
						<view><input type="text" disabled value="V1" /></view>
					</view>
					<view class="item clear">
						<text>保&ensp;证&ensp;金：</text>
						<view><input type="text" v-model="VIP1.assureAsset" disabled /></view>
					</view>
					<view class="item clear">
						<text>收款地址：</text>
						<view>
							<view class="copy">
								<input type="text" v-model="address" disabled />
								<button @click="copy(address)">复制</button>
							</view>
						</view>
					</view>
					<view class="item clear">
						<text>打款地址：</text>
						<view><input type="text" v-model="coinAddress" placeholder="请输入打款地址" /></view>
					</view>
					<view class="item clear">
						<text>打款数量：</text>
						<view><input type="text" v-model="coinNumber" placeholder="请输入打款数量" /></view>
					</view>
					<view class="item clear">
						<text>手&ensp;机&ensp;号：</text>
						<view><input type="text" v-model="phone" placeholder="请输入手机号" /></view>
					</view>
					<view class="item clear">
						<text>备注信息：</text>
						<view style="line-height: 1.8; height: 92upx;">
							<textarea style="font-size: 26upx;; padding: 10upx 20upx;" v-model="remarks" placeholder="请输入备注信息" />
						</view>
					</view>
					<view class="submits"><button @click="submits()">确认申请</button></view>
				</view>
			</template>
			<template v-if="user.applyFlag == 'INITING'">
				<view class="c2cAgent_Apply">
					<view class="tpis">您的申请已提交，正在审核中</view>
					<view class="agreement" @click="isAgreement = !isAgreement">
						<view class="checkbox">
							<template v-if="isAgreement">
								<icon type="success_no_circle" color="#999" size="10" />
							</template>
						</view>
						<text>已阅读并同意遵守</text>
						<view class="agreement_main">《法币服务协议》</view>
					</view>
					<view class="agree">同意协议并开始服务</view>
				</view>
			</template>
			<template v-if="user.applyFlag.indexOf('VIP') > -1">
				<view class="c2cApply">
					<view class="title">
						<image src="../../../static/c2c/t_bg.png" mode=""></image>
						<text>商家权益</text>
					</view>
					<view class="list">
						<view class="top">
							<text>商家等级</text>
							<text>每日交易额/CNY</text>
							<text>手续费</text>
						</view>
						<view class="bottom">
							<text>VIP1</text>
							<text>50万</text>
							<text>0.19%</text>
						</view>
						<view class="bottom">
							<text>VIP2</text>
							<text>100万</text>
							<text>0.18%</text>
						</view>
					</view>
					<view class="sj_btn">
						权益升级
					</view>
				</view>
			</template>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import service from '../service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import { REG_PHONE } from '@/common/reg.js';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
export default {
	components: {
		HMmessages,
		uniIcons
	},
	data() {
		return {
			VIP1: '',
			VIP2: '',
			VIP3: '',
			user: {
				applyFlag: ''
			},
			privilege: {},
			address: '0x1501B67ED97A887bCc66D8cAc6d6474865C93C28',
			coinAddress: '',
			coinNumber: '',
			phone: '',
			remarks: '',
			isAgreement: false
		};
	},
	onShow() {
		if (this.$api.isLogin()) {
			this.memberConfigInfo();
			return false;
		}
		this.$api.goLogin('../../login/login');
	},
	methods: {
		//确定申请
		submits() {
			if (!this.veif()) {
				return false;
			}
			let params = {
				coinAddress: this.coinAddress,
				phone: this.phone,
				remark: this.remarks,
				applyLevel: 'VIP1',
				coinNum: this.coinNumber
			};
			let that = this;
			service.userApplyMember(params).then(({ data }) => {
				if (data.code == '100200') {
					that.HMmessages.show('申请成功', {
						textAlign: 'center',
						background: '#356e36',
						fontColor: '#fff',
						callback: () => {
							that.memberConfigInfo();
						}
					});
				} else {
					this.errors(data.msg);
				}
			});
		},
		veif() {
			if (!this.coinAddress) {
				this.errors('请输入打款地址');
				return false;
			}
			if (!this.coinNumber) {
				this.errors('请输入打款数量');
				return false;
			}
			if (!REG_PHONE.test(this.phone)) {
				this.errors('请输入正确的手机号码');
				return false;
			}
			if (!this.remarks) {
				this.errors('请输入备注信息');
				return false;
			}
			return true;
		},
		//查询会员详情
		memberConfigInfo() {
			this.$api.showLoading();
			service.memberConfigInfo().then(({ data }) => {
				this.$api.hideLoading();
				if (data.code == '100200') {
					for (let i of data.data) {
						if (i.applyFlag == 'null' || !i.applyFlag) {
							this[i.member] = i;
						} else {
							this.user = i;
							this.privilege = this[this.user.applyFlag];
						}
					}
				} else {
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
		},
		//返回
		back() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
