<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="register">
			<view class="register_main">
				<view class="top_bg">
					<view class="w_bg"><image src="/static/logo.png" mode="aspectFit"></image></view>
					<view class="top_title">
						NNEX
					</view>
				</view>
				<view class="sm_b">
					<!-- <view class="register_nav">
						<button :class="type == 'phone' ? 'active' : ''" @click="type = 'phone'">手机注册</button>
						<button :class="type == 'email' ? 'active' : ''" @click="type = 'email'">邮箱注册</button>
					</view> -->
					<template v-if="type == 'phone'">
						<view class="item phone clear">
							<view class="i_left">
								<image class="img_left" src="/static/login_user.png" mode="aspectFit"></image>
								<view>
								<picker @change="set1" :value="inde" :range="tele" range-key="tel">
									<view class="flex">
										<view class="uni-inputs">+{{ tele[inde].tel }}<view class="thr"></view></view>
										<view class="triangle"></view>
									</view>
								</picker>
								</view>
							</view>
							<input type="number" v-model="phone" placeholder="请输入正确手机" />
						</view>
						<view class="item imgCode clear">
							<view class="i_left">
								<image class="img_left" src="/static/reset_emailCode.png" mode="aspectFit"></image>
								<view>验证码</view>
							</view>
							<view class="code" @click="getImgCode()"><image :src="imgUrl" style="width: 100%; height: 54upx;" mode="aspectFit"></image></view>
							<input v-model="imgCode" type="number" placeholder="请输入图片验证码" maxlength="4" />
						</view>
					</template>
					<!-- <template v-else>
						<view class="item clear"><view class="i_left">
								<image class="img_left" src="/static/reg_email.png" style="width: 26rpx; height: 33rpx" mode="aspectFit"></image>
								<view>密码</view>
							</view>
							<view class="fl"><image src="/static/reg_email.png" style="width: 27rpx; height: 33rpx" mode="aspectFit"></image></view>
							<input class="fr" v-model="email" type="text" placeholder="请输入邮箱地址" />
						</view>
					</template> -->
					<view class="item clear">
						<view class="i_left">
							<image class="img_left" src="/static/login_pwd.png" mode="aspectFit"></image>
							<view>密码</view>
						</view>
						<input v-model="newPwd" type="password" placeholder="登录密码(最小六个字符)" />
					</view>
					<view class="item clear">
						<view class="i_left">
							<image class="img_left" src="/static/login_pwd.png" mode="aspectFit"></image>
							<view>确认密码</view>
						</view>
						<input v-model="cenPwd" type="password" placeholder="确认密码" />
					</view>
					<view class="item clear">
						<view class="i_left">
							<image class="img_left" src="/static/invite.png" mode="aspectFit"></image>
							<view>邀请码</view>
						</view>
						<input v-model="inviteCode" type="text" placeholder="邀请码(选填)" />
					</view>
					<view class="item imgCode clear">
						<view class="i_left">
							<image class="img_left" src="/static/reset_emailCode.png" mode="aspectFit"></image>
							<view>验证码</view>
						</view>
						<input v-model="phoneCode" type="number" maxlength="6" placeholder="请输入手机验证码" />
						<view v-if="numTime == false" class="code" @click="getCode()"><button plain>发送验证码</button></view>
						<view v-else class="code">
							<button plain disabled>{{ numText }}</button>
						</view>
					</view>
					<!-- <view class="agreement" @click="isAgreement = !isAgreement">
						<view class="checkbox">
							<template v-if="isAgreement">
								<icon type="success_no_circle" color="#fff" size="10" />
							</template>
						</view>
						<text>注册即视为同意</text>
						<view class="agreement_main" @click="$goPage('agreement/agreement')">《用户注册协议》</view>
					</view> -->
					<view class="item submit"><button @click="submits()">注册</button></view>
					<view class="agreement">
						<text>已经注册？</text>
						<view class="agreement_main" @click="back()">去登陆</view>
					</view>
				</view>
			</view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
import service from './service.js';
import comSvc from '@/common/comSvc.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import { REG_PHONE, REG_EMAIL } from '../../common/reg.js';
import tel from '../../static/js/tel.js';
export default {
	components: {
		uniIcon,
		HMmessages
	},
	data() {
		return {
			type: 'phone',
			phone: '',
			email: '',
			imgUrl: '',
			time: '',
			imgCode: '',
			phoneCode: '',
			newPwd: '',
			cenPwd: '',
			inviteCode: '',
			isAgreement: false,
			numTime: false,
			num: 60,
			timeInt: null,
			numText: '60秒',
			inde: 0,
			tele: [],
		};
	},
	watch: {
		type() {
			this.phone = '';
			this.phoneCode = '';
			this.imgCode = '';
			this.newPwd = '';
			this.cenPwd = '';
			this.email = '';
		},
		phone() {
			const reg = /\s/;
			if (reg.test(this.phone)) {
				this.phone = this.phone.replace(reg, '');
				return;
			}
		},
		phoneCode() {
			const reg = /\s/;
			if (reg.test(this.phoneCode)) {
				this.phoneCode = this.phoneCode.replace(reg, '');
				return;
			}
		},
		imgCode() {
			const reg = /\s/;
			if (reg.test(this.imgCode)) {
				this.imgCode = this.imgCode.replace(reg, '');
				return;
			}
		},
		newPwd() {
			const reg = /\s/;
			if (reg.test(this.newPwd)) {
				this.newPwd = this.newPwd.replace(reg, '');
				return;
			}
		},
		cenPwd() {
			const reg = /\s/;
			if (reg.test(this.cenPwd)) {
				this.cenPwd = this.cenPwd.replace(reg, '');
				return;
			}
		},
		email() {
			const reg = /\s/;
			if (reg.test(this.email)) {
				this.email = this.email.replace(reg, '');
				return;
			}
		}
	},
	onLoad(option) {
		if (option && option.code) {
			this.inviteCode = option.code;
		}
	},
	created() {
		this.getImgCode();
		this.tele = tel;
	},
	//页面离开，删除定时器
	onUnload() {
		this.timeInt && clearInterval(this.timeInt);
	},
	methods: {
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
		//选择1
		set1(e) {
			this.inde = e.target.value;
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
		verif(name) {
			if (this.type == 'phone') {
				if (!this.phone) {
					this.errors('请输入手机号码');
					return false;
				} else if (!REG_PHONE.test(this.phone)) {
					this.errors('请输入正确的手机号码');
					return false;
				}
				if (!this.imgCode) {
					this.errors('请输入图片验证码');
					return false;
				}
				if (name == 'getCode') {
					return true;
				}
				if (!this.phoneCode) {
					this.errors('请输入手机验证码');
					return false;
				}
			} else {
				if (!this.email) {
					this.errors('请输入邮箱');
					return false;
				}
				if (!REG_EMAIL.test(this.email)) {
					this.errors('请输入正确的邮箱');
					return false;
				}
			}
			if (!this.newPwd || this.newPwd.length < 6) {
				this.errors('请输入不小于六位字符的登录密码');
				return false;
			}
			if (!this.cenPwd) {
				this.errors('请再次确认密码');
				return false;
			}
			if (this.cenPwd != this.newPwd) {
				this.errors('密码不一致，请重新输入');
				return false;
			}
			// if (!this.isAgreement) {
			// 	this.errors('请同意用户注册协议');
			// 	return false;
			// }

			return true;
		},
		//注册
		submits() {
			if (!this.verif()) {
				return false;
			}
			let param = {
				loginPassword: this.cenPwd
			};
			let header = {
				'account-no': '86' + this.phone
			};
			if (this.inviteCode) {
				param.refereeCode = this.inviteCode;
			}
			let name = 'phoneAccount';
			if (this.type == 'phone') {
				header['service-code'] = this.phoneCode;
			} else {
				header['account-no'] = this.email;
				name = 'preRegister';
			}
			service[name](param, header).then(({ data }) => {
				if (data.code == '100200') {
					let that = this;
					if (this.type == 'phone') {
						// #ifdef APP-PLUS
						this.HMmessages.show('注册成功，稍后将返回登录', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff',
							callback: () => {
								that.back();
							}
						});
						// #endif
						// #ifdef H5
						this.HMmessages.show('注册成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
						uni.showModal({
							title: '注册成功',
							content: '下载APP体验最新内容',
							success: res => {
								if (res.confirm) {
									uni.redirectTo({
										url: '/pages/downloadApp/downloadApp'
									});
								} else if (res.cancel) {
									that.back();
								}
							}
						});
						// #endif
					} else {
						// #ifdef APP-PLUS
						this.HMmessages.show('请注意查收邮箱的激活链接', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff',
							callback: () => {
								that.back();
							}
						});
						// #endif
						// #ifdef H5
						this.HMmessages.show('注册成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
						uni.showModal({
							title: '注册成功',
							content: '下载APP体验最新内容',
							success: res => {
								if (res.confirm) {
									uni.redirectTo({
										url: '/pages/downloadApp/downloadApp'
									});
								} else if (res.cancel) {
									that.back();
								}
							}
						});
						// #endif
					}
				} else {
					if (this.type == 'phone') {
						this.errors(data.msg);
					} else {
						if (data.code == '104100') {
							this.errors('该邮箱已被注册');
						} else {
							this.errors(data.msg);
						}
					}
				}
			});
		},
		//获取图片验证码
		getImgCode() {
			this.time = new Date().getTime();
			this.imgUrl = '/exchangeApi/captchar/code?randomKey=' + this.time;
			// #ifdef APP-PLUS
			this.imgUrl = this.$api.baseUrl + '/exchangeApi/captchar/code?randomKey=' + this.time;
			// #endif
		},
		//获取验证码
		getCode() {
			if (!this.verif('getCode')) {
				return false;
			}
			comSvc
				.getCode(
					{
						sendType: 'PHONE',
						sendAccount: '86' + this.phone
					},
					{
						'captchar-code': this.imgCode,
						'captchar-no': this.time
					}
				)
				.then(({ data }) => {
					if (data.code == '100200') {
						this.numTime = true;
						this.times();
						this.HMmessages.show('验证码已发送', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
					} else {
						this.getImgCode();
						this.errors(data.msg);
					}
				});
		},
		//修改手机返回
		back() {
			let length = getCurrentPages();
			if (length.length == 1) {
				uni.redirectTo({
					url: '../login/login'
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
