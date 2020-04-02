<template>
	<view class="content invitation">
		<view class="invite_bg">
			<image class="bg" src="../../../static/invite_bg.png" mode=""></image>
			<uni-icons @click="goBack()" class="icons" type="arrowleft" :color="'#fff'" size="24"></uni-icons>
		</view>
		<view class="invite_code">
			<view class="block">
				<text>我的邀请链接</text>
				<view class="">{{ address }}</view>
				<image @click="copy(address)" src="../../../static/copy.png" mode=""></image>
			</view>
			<view class="block">
				<text>我的邀请码</text>
				<view @click="copy(code)" class="">{{ code }}</view>
				<image @click="copy(code)" src="../../../static/copy.png" mode=""></image>
			</view>
		</view>
		<!-- @click="share()" -->
		<view class="my_invite">
			<view class="b_line"></view>
			<view class="my_block">
				<view class="title">我的邀请码</view>
				<view v-if="!isImg" class="main_qrcode" @click="isImg=true"><tki-qrcode ref="qrcode" :cid="'1'" :val="address" :loadMake="true" :onval="true" :size="230" /></view>
			</view>
		</view>
		<view class="invite_list">
			<view class="b_line"></view>
			<view class="title">
				<text>邀请记录</text>
				<view class="" @click="$goPage('inviteList/inviteList')">
					<text class="more">更多</text>
					<uni-icons class="icons" type="arrowright" :color="'#E7EBEE'" size="24"></uni-icons>
				</view>
			</view>
			<view class="my_block">
				<view class="th">
					<text class="one">UID</text>
					<text class="two">账号</text>
					<text class="three">注册时间</text>
				</view>
				<view class="tr" v-for="(item, index) in list" :key="index">
					<text class="one">{{ filter.getFormattedUid(item.uid) }}</text>
					<text class="two">{{ REG_EMAIL.test(item.account) ? filter.email(item.account) : filter.getSuffixPhone(item.account) }}{{ item.authFlag == 'INIT' ? '(未认证)' : '' }}</text>
					<text class="three">{{ $formta(item.createTime, 'yyyy-MM-dd') }}</text>
				</view>
				<uni-load-more :status="loading ? 'loading' : !list[0] ? 'noMore' : 'noMore'"></uni-load-more>
			</view>
		</view>
		<view v-if="isImg" class="Modal_mask" @click="isImg=false"></view>
		<view class="c_modal" v-if="isImg">
			<view class="qrcode"><tki-qrcode ref="qrcode1" :val="address" :cid="'2'" :onval="true" :loadMake="true" :size="750" /></view>
		</view>
		<image v-if="isImg" @click="downImg()" class="down" src="../../../static/account/down.png" mode=""></image>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
import service from '../service.js';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
export default {
	components: {
		tkiQrcode,
		HMmessages,
		uniIcons,
		uniLoadMore
	},
	data() {
		return {
			code: '',
			address: 'http://nnex.io' + `/#/pages/register/register?code=${this.code}`,
			list: [],
			loading: true,
			isImg: false,
		};
	},
	onShow() {
		if (this.$api.isLogin()) {
			this.getCode();
			return false;
		}
		this.$api.goLogin('../../login/login');
	},
	onLoad() {
		this.getInviteList();
	},
	onNavigationBarButtonTap(e) {
		if (e.type != 'share') {
			uni.navigateTo({
				url: 'inviteList/inviteList'
			});
		} else {
			let text =
				'nnex是在2017年由共赢集团领投，多位数字资产爱好者创建而成，它是一个专注区块链资产兑换平台。公司总部在马来西亚吉隆坡，为全球用户提供便捷的数字资产兑换环境，在各国法律框架下合规运营，保障用户资产100%安全，平台使用多重签名+冷热分离的安全方案。提供高端而又安全的交易环境和专业优质的客户服务，赢得行业用户的口碑！';
			let imgUrl = 'http://nnex.io/' + '/bera-manage/news/image-get?id=5d5a4be5496b6905596083a5';
			let that = this;
			let arr = ['分享到微信好友', '分享到微信朋友圈', '复制邀请链接', '取消分享'];
			// #ifdef H5
			arr = ['复制邀请链接'];
			// #endif
			uni.showActionSheet({
				itemList: arr,
				success: function(res) {
					// #ifdef APP-PLUS
					if (res.tapIndex == 0) {
						uni.share({
							provider: 'weixin',
							scene: 'WXSceneSession',
							type: 0,
							href: that.address,
							title: 'nnex邀请您注册玩转区块链',
							summary: text,
							imageUrl: imgUrl,
							success: function(res) {},
							fail: function(err) {}
						});
					} else if (res.tapIndex == 1) {
						uni.share({
							provider: 'weixin',
							scene: 'WXSenceTimeline',
							type: 0,
							href: that.address,
							title: 'nnex邀请您注册玩转区块链',
							summary: text,
							imageUrl: imgUrl,
							success: function(res) {},
							fail: function(err) {}
						});
					} else if (res.tapIndex == 2) {
						that.copy(that.address);
					}
					// #endif
					// #ifdef H5
					if (res.tapIndex == 0) {
						that.copy(that.address);
					}
					// #endif
					// console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				},
				fail: function(res) {
					// console.log(res.errMsg);
				}
			});
		}
	},
	methods: {
		//返回
		goBack() {
			uni.navigateBack({
				
			})
		},
		//下载图片
		downImg() {
			 this.$refs.qrcode1._saveCode()
		},
		//分享
		share() {
			let text =
				'nnex是在2017年由共赢集团领投，多位数字资产爱好者创建而成，它是一个专注区块链资产兑换平台。公司总部在马来西亚吉隆坡，为全球用户提供便捷的数字资产兑换环境，在各国法律框架下合规运营，保障用户资产100%安全，平台使用多重签名+冷热分离的安全方案。提供高端而又安全的交易环境和专业优质的客户服务，赢得行业用户的口碑！';
			let imgUrl = 'http://nnex.io/' + '/bera-manage/news/image-get?id=5d5a4be5496b6905596083a5';
			let that = this;
			let arr = ['分享到微信好友', '分享到微信朋友圈', '复制邀请链接', '取消分享'];
			// #ifdef H5
			arr = ['复制邀请链接'];
			// #endif
			uni.showActionSheet({
				itemList: arr,
				success: function(res) {
					// #ifdef APP-PLUS
					if (res.tapIndex == 0) {
						uni.share({
							provider: 'weixin',
							scene: 'WXSceneSession',
							type: 0,
							href: that.address,
							title: 'nnex邀请您注册玩转区块链',
							summary: text,
							imageUrl: imgUrl,
							success: function(res) {},
							fail: function(err) {}
						});
					} else if (res.tapIndex == 1) {
						uni.share({
							provider: 'weixin',
							scene: 'WXSenceTimeline',
							type: 0,
							href: that.address,
							title: 'nnex邀请您注册玩转区块链',
							summary: text,
							imageUrl: imgUrl,
							success: function(res) {},
							fail: function(err) {}
						});
					} else if (res.tapIndex == 2) {
						that.copy(that.address);
					}
					// #endif
					// #ifdef H5
					if (res.tapIndex == 0) {
						that.copy(that.address);
					}
					// #endif
					// console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				},
				fail: function(res) {
					// console.log(res.errMsg);
				}
			});
		},
		//获取邀请列表
		getInviteList() {
			this.loading = true;
			service.getInviteList().then(({ data }) => {
				this.loading = false;
				if (data.code == '100200') {
					this.list = data.data;
				} else {
					this.errors(data.msg);
				}
			});
		},
		
		//获取邀请码
		getCode() {
			service.getCode().then(({ data }) => {
				if (data.code == '100200') {
					this.code = data.data;
					this.address = 'http://nnex.io' + `/#/pages/register/register?code=${this.code}`;
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
					uni.showToast({
					  icon: 'none',
					  title: '复制成功'
					})
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
