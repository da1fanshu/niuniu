<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="NavBar">
			<view class="back" @click="back()"><uni-icons type="arrowleft" :size="28" :color="'#fff'" style="margin-left: -14rpx;"></uni-icons></view>
			<text>提币</text>
			<image @click="$goPage(`../record/record?type=${coinList[values]}`)" src="../../../static/record.png" mode=""></image>
		</view>
		<view class="withdraw">
			<view class="withdraw_nav">
				<view class="ll" :class="type == 'ordinary' ? 'active' : ''" @click="type = 'ordinary'">普通提币</view>
				<view class="rr" :class="type == 'stand' ? 'active' : ''" @click="type = 'stand'">站内转币</view>
			</view>
			<picker @change="bindPickerChange" :value="values" :range="coinList">
				<view class="g_block">
					<view class="g_left">{{ coinList[values] }}</view>
					<view class="g_right">
						<text>选择币种</text>
						<uni-icons style="margin-right: -11rpx;" type="arrowright" :color="'#C5CFD5'" size="22"></uni-icons>
					</view>
				</view>
			</picker>
			<view class="title" v-if="type == 'ordinary'">链名称</view>
			<view class="chain" v-if="type == 'ordinary'">
				<view :class="{ active: index == inde }" @click="inde = index" v-for="(item, index) in chain" :key="index">{{ item }}</view>
			</view>
			<view class="d_input" v-if="type == 'ordinary'">
				<view class="label" style="margin-top: 0;">
					提币地址
				</view>
				<view class="d_block">
					<input type="text" value="" placeholder-class="plc" placeholder="输入或长按粘贴地址"/>
					<view class="right">
						<image class="sm" src="../../../static/sm.png" mode=""></image>
						<view class="w_line"></view>
						<image @click="$goPage('withdrawAddress/withdrawAddress')" class="bd" src="../../../static/bd.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="d_input" v-if="type == 'stand'">
				<view class="label" style="margin-top: 30rpx;">
					对方UID
				</view>
				<view class="d_block">
					<input type="text" value="" placeholder-class="plc" placeholder="请输入对方UID"/>
				</view>
			</view>
			<view class="d_input">
				<view class="label">
					提币数量
				</view>
				<view class="d_block">
					<input type="text" value="" placeholder-class="plc" placeholder="最小提币数量2"/>
					<view class="right">
						<text class="t1">BTC</text>
						<view class="w_line"></view>
						<text class="t2">全部</text>
					</view>
				</view>
			</view>
			<view class="sm_title">
				可用 0.000000BTC
			</view>
			<view class="d_input">
				<view class="label">
					网络手续费
				</view>
				<view class="d_block">
					<input type="text" v-model="fee" value="" disabled="true"/>
					<view class="right">
						<text class="t1">BTC</text>
					</view>
				</view>
			</view>
		<!-- 	<view class="withdraw_form">
				<template v-if="type == 'ordinary'">
					<view class="item clear">
						<text class="fl">提币地址:</text>
						<view class="fr" @click="showList = true">
							<input
								style="float: left; width: 100%; height: 100%; width: calc(100% - 90upx);"
								v-model="form.address"
								type="text"
								disabled
								placeholder="请选择提币的地址"
							/>
							<button style="width: 54upx; float: right;">选择</button>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="item clear">
						<text class="fl">对方ID:</text>
						<view class="fr"><input style="width: 100%; height: 100%;" v-model="form.uid" type="number" placeholder="请输入对方ID" /></view>
					</view>
				</template>
				<view class="item clear">
					<text class="fl">提币数量:</text>
					<view class="fr">
						<input
							v-model="form.number"
							:maxlength="maxNumberLnegth"
							style="float: left; width: calc(100% - 54upx); height: 100%;"
							type="digit"
							:placeholder="'可用:' + asset"
						/>
						<button style="width: 54upx;" @click="form.number = asset">全部</button>
					</view>
				</view>
				<view class="item clear">
					<text class="fl">最低提币:</text>
					<view class="fr"><input style="width: 100%; height: 100%;" v-model="mini" disabled /></view>
				</view>
				<view class="item clear">
					<text class="fl">区块费用:</text>
					<view class="fr"><input style="width: 100%; height: 100%;" v-model="fee" disabled /></view>
				</view>
				<view class="item clear">
					<text class="fl">资金密码:</text>
					<view class="fr">
						<input v-model="form.pwd" style=" height: 100%;" type="password" placeholder="请输入资金密码" />
						<button @click="$goPage('../../account/securitySetting/securitySetting')">忘记资金密码？</button>
					</view>
				</view>
				<view class="item clear" v-if="GOOGLE.status == 'ON'">
					<text class="fl">谷歌验证:</text>
					<view class="fr"><input v-model="form.google" maxlength="6" style="width: 100%; height: 100%;" type="number" placeholder="请输入谷歌验证码" /></view>
				</view>
			</view>
		 -->	
			<view class="withdraw_tpis" v-if="type == 'ordinary'">
				<view>禁止向{{ coin }}地址充值除{{ coin }}之外的资产，任何充入{{ coin }}地址的非{{ coin }}资产将不可找回</view>
				<view>
					1.本站 {{ coin }} 的钱包地址底层链为 {{ COINCONFIG.asset[coin] }},转出区块时请确认收款地址也为该底层。
				</view>
				<view>
					2.虚拟币转账在网络确认数达到3个确认后自动入账。
				</view>
				<view>
					3.支持金额：最低提现金额为 <text>0.0001</text>BTC
				</view>
				<view class="lst">
					4.提币限额：每日最高可提币<text>100</text>BTC
				</view>
			</view>
			<view class="withdraw_tpis" v-if="type == 'stand'">
				<view>支持金额：最低提现金额为<text>0.0001</text>{{ coin }}</view>
				<view>
					转账限额：每日最高可转账<text>100</text>BTC
				</view>
				<view>
					请确保转账UID无误
				</view>
			</view>
			<view class="b_title">
				<text class="wz">到账数量</text>
				<text>0.000000BTC</text>
			</view>
			<view class="blue_btn" @click="isDraw=true">提币</view>
		</view>
		<uni-popup :show="showList" position="bottom" mode="fixed" @hidePopup="hidePopup()">
			<view class="transfer_select">
				<view class="item title">选择地址</view>
				<view v-for="(item, index) in outList" :key="index" class="item" @click="setAccount('out', item)">{{ item }}</view>
				<view class="btn" @click="addAddress(false)">添加地址</view>
			</view>
		</uni-popup>
		<!-- 输入资金密码 -->
		<Modal :title="'提币'" v-if="isDraw" @close="closeModal('isDraw')">
			<view class="common_model">
				<view class="center_model">
					<view class="l_input">
						<text>资金密码</text>
						<input type="password" placeholder-class="pla" v-model="form.pwd" placeholder="请输入资金密码" />
					</view>
					<view class="l_input">
						<text>短信验证</text>
						<input type="password" placeholder-class="pla" v-model="form.code" placeholder="请输入验证码" />
						<view v-if="numTime == false" class="send" @click="getCode()"><button plain>发送验证码</button></view>
						<view v-else class="send">
							<button plain disabled>{{ numText }}</button>
						</view>
					</view>
				</view>
				<view class="common_btn">
					<view @click="closeModal('isDraw')">取消</view>
					<view class="active" @click="exemptionPayPwd(true)">确定</view>
				</view>
			</view>
		</Modal>
		<!-- 添加地址 -->
		<Modal :title="'添加地址'" :isMask="true" v-if="isAddress" @close="closeModal('isAddress')">
			<view class="common_model">
				<view class="common_form">
					<view class="item clear">
						<text class="fl">名称:</text>
						<view class="fr"><input type="text" v-model="name" placeholder="请输入地址名称" /></view>
					</view>
					<!-- #ifdef H5 -->
					<view class="item clear">
						<text class="fl">地址:</text>
						<view class="fr"><input type="text" v-model="address" placeholder="请输入地址(请认真核对)" /></view>
					</view>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view class="item imgCode clear">
						<text class="fl">地址:</text>
						<view class="fr">
							<view class="code"><button plain @click="scan">扫描</button></view>
							<input type="text" v-model="address" placeholder="请输入地址(请认真核对)" />
						</view>
					</view>
					<!-- #endif -->
				</view>
				<view class="add_btn">
					<view @click="closeModal('isAddress')">取消</view>
					<view class="active" @click="addAddress(true)">确定</view>
				</view>
			</view>
		</Modal>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { uniPopup } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from '../service.js';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import Modal from '@/components/lkex-modal/index.vue';
import comSvc from '@/common/comSvc.js';
import { mapGetters } from 'vuex';
export default {
	components: {
		uniPopup,
		HMmessages,
		Modal,
		uniIcons
	},
	computed: {
		...mapGetters(['GOOGLE', 'COINCONFIG'])
	},
	data() {
		return {
			type: 'ordinary',
			asset: 0,
			fee: 0,
			mini: 0,
			isDraw: false,
			form: {
				address: '',
				uid: '',
				number: '',
				pwd: '',
				google: '',
				code: '',
			},
			maxNumberLnegth: -1,
			showList: false,
			isAddress: false,
			outList: [],
			coin: 'ALL',
			name: '',
			address: '',
			values: 0,
			coinList: ['BTC', 'USDT'],
			chain: ['ERC20', 'TRC20', '0MNI'],
			inde: 0,
			numTime: false,
			numText: '60秒',
			num: 60,
		};
	},
	onLoad(option) {
		if (option && option.type) {
			uni.setNavigationBarTitle({
				title: option.type + '提币'
			});
			this.coin = option.type;
		}
	},
	onUnload() {
		this.$store.commit('setAddress', '');
	},
	onShow() {
		this.form.address = this.$store.state.coinAddress;
		this.getAsset();
		this.getFee();
		this.getMini();
	},
	watch: {
		'form.number'(val) {
			this.setMaxLength('form.number', val, 'maxNumberLnegth');
		}
	},
	methods: {
		//返回
		back() {
			uni.navigateBack()
		},
		//设置小数点位数长度
		setMaxLength(name, val, maxName) {
			let precision = 4;
			let arrs = val.split('.');
			let attr0 = arrs[0];
			let attr1 = arrs[1];
			if (attr1) {
				this[name] = attr0 + '.' + attr1.slice(0, precision);
				this[maxName] = attr1.slice(0, precision).length == 4 ? this[name].length : -1;
			} else {
				this[maxName] = -1;
			}
		},
		//设置币种
		bindPickerChange(e) {
			this.values = e.target.value;
		},
		//添加地址
		addAddress(bool) {
			if (this.outList.length >= 5) {
				this.errors('地址最多添加五个，请删除部分地址重试');
				return false;
			}
			if (!bool) {
				this.isAddress = true;
				return false;
			}
			if (!this.name) {
				this.errors('请输入地址名称');
				return false;
			}
			if (!this.address) {
				this.errors('请输入地址');
				return false;
			}
			this.$api.showLoading();
			service
				.addAddress({
					address: this.address,
					assetCode: this.coin,
					memo: this.name
				})
				.then(({ data }) => {
					this.$api.hideLoading();
					if (data.code == '100200') {
						this.closeModal('isAddress');
						this.getList();
						this.HMmessages.show('添加地址成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
					} else {
						this.errors(data.msg);
					}
				});
		},
		//隐藏弹窗
		closeModal(name) {
			this[name] = !this[name];
			this.name = '';
			this.address = '';
		},
		//获取验证码倒计时
		times() {
			let that = this;
			clearInterval(this.timeInt);
			this.timeInt = setInterval(() => {
				that.num--;
				if (that.num == 0) {
					clearInterval(that.time);
					that.numTime = false;
					that.num = 60;
					that.numText = that.num + '秒';
				} else {
					that.numText = that.num + '秒';
					that.times();
				}
			}, 1000);
		},
		//获取验证码
		getCode() {
			let type = '';
			if (REG_EMAIL.test(this.USERINFO.account)) {
				type = 'EMAIL';
			} else {
				type = 'PHONE';
			}
			this.$api.showLoading();
			comSvc
				.getCode({
					sendType: type,
					sendAccount: this.USERINFO.account
				})
				.then(({ data }) => {
					this.$api.hideLoading();
					if (data.code == '100200') {
						this.numTime = true;
						this.times();
						this.HMmessages.show('验证码已发送', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
					} else {
						uni.showToast({
							title: data.msg,
							icon: 'none'
						});
					}
				});
		},
		//获取地址列表
		getList() {
			service
				.addressList({
					assetCode: this.coin,
					pageNo: 1,
					pageSize: 5
				})
				.then(({ data }) => {
					if (data.code == '100200') {
						this.list = data.data.list;
					} else {
						this.errors(data.msg);
					}
				});
		},
		//删除地址
		del(item) {
			let that = this;
			uni.showModal({
				title: '删除地址',
				content: '删除地址后无法恢复，是否操作？',
				success(res) {
					if (res.confirm) {
						that.$api.showLoading();
						service
							.delAddress({
								id: item.addressid
							})
							.then(({ data }) => {
								that.$api.hideLoading();
								if (data.code == '100200') {
									that.getList();
									that.HMmessages.show('删除地址成功', {
										textAlign: 'center',
										background: '#356e36',
										fontColor: '#fff'
									});
								} else {
									that.errors(data.msg);
								}
							});
					}
				}
			});
		},
		hidePopup() {
			this.showList = false;
		},
		//确定提现
		submits() {
			if (!this.veif()) {
				return false;
			}
			let name = 'withdrawAddress';
			let params = {
				amount: this.form.number,
				assetCode: this.coin,
				fee: this.fee,
				message: '',
				outOrder: this.$api.outOrder()
			};
			if (this.type != 'ordinary') {
				name = 'withdrawUser';
				params.depositUid = this.form.uid;
			} else {
				params.address = this.form.address;
			}
			this.$api.showLoading();
			service[name](params, {
				'pay-password': this.form.pwd,
				'service-code': '',
				'google-code': this.form.google
			}).then(({ data }) => {
				this.$api.hideLoading();
				if (data.code == '100200') {
					this.form = {
						address: '',
						uid: '',
						number: '',
						pwd: '',
						google: ''
					};
					this.getAsset();
					this.HMmessages.show('提币成功，可在该币种的记录查看', {
						textAlign: 'center',
						background: '#356e36',
						fontColor: '#fff'
					});
				} else {
					this.errors(data.msg);
				}
			});
		},
		//获取提现手续费
		getFee() {
			service
				.getFee({
					key: 'WITHDRAWMINFEE',
					assetCode: this.coin
				})
				.then(({ data }) => {
					if (data.code == '100200') {
						this.fee = data.data.profileValue;
					} else {
						this.errors(data.msg);
					}
				});
		},
		//获取最小提现数额
		getMini() {
			service
				.getFee({
					key: 'WITHDRAWMIN',
					assetCode: this.coin
				})
				.then(({ data }) => {
					if (data.code == '100200') {
						this.mini = data.data.profileValue;
					} else {
						this.errors(data.msg);
					}
				});
		},
		//获取用户可用资产
		getAsset() {
			let that = this;
			this.$api.showLoading();
			comSvc.getAssets().then(({ data }) => {
				this.$api.hideLoading();
				if (data.code == '100200') {
					data.data.map((e, i) => {
						if (e.assetCode == that.coin) {
							that.asset = e.amountAvailable;
						}
					});
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
		//验证
		veif() {
			if (this.type == 'ordinary') {
				if (!this.form.address) {
					this.errors('请输入提币地址');
					return false;
				}
			} else {
				if (!this.form.uid) {
					this.errors('请输入对方ID');
					return false;
				}
			}
			if (!this.form.number && !Number(this.form.number)) {
				this.errors('请输入正确的提币数量');
				return false;
			}
			if (!this.form.pwd) {
				this.errors('请输入资金密码');
				return false;
			}
			if (this.GOOGLE.status == 'ON') {
				if (!this.form.google) {
					this.errors('请输入谷歌验证码');
					return false;
				}
			}
			return true;
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
