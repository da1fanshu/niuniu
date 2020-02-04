<template>
	<view class="content index">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="index_header" v-if="isLogin == false">
			<view class="i_h_logo"><image src="/static/logo.jpg" style="width: 257upx; height: 56upx;margin-left: -32upx;" mode=""></image></view>
			<view class="i_h_login">
				<button @click="$goPage('../login/login')">登录/注册</button>
				<!-- <image src="/static/cn.jpg" style="width: 75upx; height: 50upx;margin-top: 2upx; margin-left: 20upx;" mode=""></image> -->
			</view>
		</view>
		<view class="index_banner">
			<swiper style="height: 307upx;" :autoplay="true" :circular="true" :interval="5000" :duration="1000">
				<swiper-item v-for="(item, index) in IMGLIST" :key="index">
					<view class="swiper-item"><image :lazy-load="true" :src="item.imageAddress" style="width: 100%; height: 307upx;" mode=""></image></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item"><image :lazy-load="true" src="/static/banner1.gif" style="width: 100%; height: 307upx;" mode=""></image></view>
				</swiper-item>
				<swiper-item v-if="!IMGLIST[0]"><uni-load-more color="#fff" status="loading"></uni-load-more></swiper-item>
			</swiper>
			<view class="banner_hot">
				<view class="b_h_left"><image src="/static/notice.png" style="width: 34upx; height: 26upx ;" mode=""></image></view>
				<view class="b_h_list">
					<swiper style="height: 44upx;" :autoplay="true" :circular="true" :vertical="true" :interval="3000" :duration="1000">
						<swiper-item v-for="(item, index) in noticeList" :key="index" @click="$goPage('newInfo/newDetails/newDetails?id=' + item.id)">
							<view class="swiper-item">{{ item.title }}</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="index_fun">
			<view class="fun_mian">
				<view class="f_m_item">
					<!-- @click="goPage('newInfo/newInfo')" -->
					<view class="i_flex" @click="$goPage('newInfo/newInfo')">
						<image src="/static/huodong.png" mode=""></image>
						<text>最新活动</text>
					</view>
					<view class="i_flex" @click="$goPage('newNotice/newNotice')">
						<image src="/static/zixun.png" mode=""></image>
						<text>公告资讯</text>
					</view>
					<view class="i_flex" @click="isLogins()">
						<image src="/static/shouyi.png" mode=""></image>
						<text>早起打鸟</text>
					</view>
					<view class="i_flex" @click="isPower()">
						<image src="/static/power.png" mode=""></image>
						<text>比特算力</text>
					</view>
				</view>
			</view>
		</view>
		<view class="index_ban" @click="isPower()"><image src="/static/banner.png" mode=""></image></view>
		<view class="index_news">
			<view class="uni-timeline">
				<view class="index_title">最新活动/资讯</view>
				<block v-for="(item, index) in list" :key="index">
					<view
						class="uni-timeline-item"
						:class="[index == 0 ? 'uni-timeline-first-item' : '', index == list.length - 1 ? 'uni-timeline-last-item' : '']"
						@click="$goPage('newInfo/newDetails/newDetails?id=' + item.id)"
					>
						<view class="uni-timeline-item-divider"></view>
						<view class="uni-timeline-item-content">
							<view class="datetime">{{ $formta(item.createTime, 'yyyy-MM-dd') }}</view>
							<view class="title" v-if="item.type == 'NOTICE'">[公告] {{ item.title }}</view>
							<view class="title" v-if="item.type == 'ACTIVITY'">[活动] {{ item.title }}</view>
							<view class="title" v-if="item.type == 'TOP'">[资讯] {{ item.title }}</view>
							<view class="text">{{ item.summary }}</view>
						</view>
					</view>
				</block>
				<uni-load-more v-if="loading" :status="loading ? 'loading' : 'noMore'"></uni-load-more>
			</view>
			<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
			<yomol-upgrade :type="upgradeType" :url="upgradeUrl" title="发现新版本" :content="upgradeContent" ref="yomolUpgrade"></yomol-upgrade>
		</view>
		<!-- #ifdef H5 -->
		<view class="down_app clear" v-if="$store.state.closeDown == false">
			<text class="fl" @click="$goPage('/pages/downloadApp/downloadApp')">前往下载APP</text>
			<uni-icon @click="closeDown()" class="fr" type="closeempty" color="#fff" size="30"></uni-icon>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import service from './service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import yomolUpgrade from '@/components/yomol-upgrade/yomol-upgrade.vue';
import { uniLoadMore, uniIcon } from '@dcloudio/uni-ui';
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		HMmessages,
		uniLoadMore,
		yomolUpgrade,
		uniIcon
	},
	data() {
		return {
			isLogin: false,
			pageNo: 1,
			pageSize: 10,
			list: [],
			loading: true,
			noData: false,
			tokens: uni.getStorageSync('TOKEN'),
			upgradeType: 'pkg', //pkg 整包 wgt 升级包
			upgradeContent: '', //更新内容
			upgradeUrl: 'https://lkex.co//download/lkex.apk', //更新地址
			noticeList: []
		};
	},
	computed: {
		...mapGetters(['IMGLIST', 'APPVERSION', 'USERINFO'])
	},
	watch: {
		'$store.state.appVersion'(val) {
			// #ifdef APP-PLUS
			if (this.APPVERSION.renew && this.APPVERSION.renew.version && this.APPVERSION.old.version != this.APPVERSION.renew.version) {
				this.upgradeContent = this.APPVERSION.renew.message;
				setTimeout(() => {
					this.$refs.yomolUpgrade.show();
				}, 500);
			}
			// #endif
		}
	},
	mounted() {
		this.getNewList();
		this.getAppId();
		this.getNoticeList();
	},
	onLoad(option) {
		if (option && option.html) {
			uni.navigateTo({
				url: `../activation/activation?id=${option.userPreRegistrationId}&code=${option.randomCode}`
			});
		} else if (option.type == 'red') {
			uni.navigateTo({
				url: `/pages/luckDraw/luckDraw?redCode=${option.redCode}`
			});
		}
	},
	onShow() {
		let token = uni.getStorageSync('TOKEN');
		if (token) {
			this.isLogin = true;
		} else {
			this.isLogin = false;
		}
	},
	methods: {
		closeDown() {
			this.$store.commit('setCloseDown', true);
		},
		getQueryString(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		//获取公告前5滚动
		getNoticeList() {
			service
				.getNewList({
					type: 'NOTICE',
					pageNo: 1,
					pageSize: 5
				})
				.then(({ data }) => {
					if (data.code == '100200') {
						this.noticeList = data.data.records;
					} else {
						this.errors(data.msg);
					}
				});
		},
		getCloudInfo() {
			service.getCloudInfo().then(({ data }) => {
				if (data.code == '100200') {
					window.location.href = `http://pool.lkex.co/#/?uid=${data.data.uid}&token=${data.data.token}&tokens=${this.tokens}&status=${this.$store.state.closeDown}`;
				} else {
					this.errors(data.msg);
				}
			});
		},
		...mapActions(['getAppId']),
		//判断是否登录
		isLogins() {
			if (this.$api.isLogin()) {
				this.$goPage('activity/activityMain/activityMain');
				return false;
			}
			this.$api.goLogin('../login/login');
		},

		isPower() {
			if (this.$api.isLogin()) {
				// #ifdef APP-PLUS
				this.$goPage(`power/power?tokens=${this.tokens}`);
				//#endif
				//#ifdef H5
				this.getCloudInfo();
				//#endif
				return false;
			}
			this.$api.goLogin('../login/login');
		},
		//尚未开启
		noOpen() {
			uni.showToast({
				icon: 'none',
				title: '敬请期待',
				position: 'bottom'
			});
		},
		//获取公告资讯
		getNewList() {
			this.loading = true;
			service
				.getNewList({
					type: 'ALL',
					pageNo: 1,
					pageSize: 5
				})
				.then(({ data }) => {
					this.loading = false;
					if (data.code == '100200') {
						this.list = this.list.concat(data.data.records);
						if (data.data.pages == 1 || data.data.pages == 0) {
							this.noData = true;
							return false;
						}
						if (this.pageNo >= data.data.pages) {
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
			this.getNewList();
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
