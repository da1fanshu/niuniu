<template>
	<view class="content">
		<web-view v-if="shows" :src="`https://whole.lkex.co/activeWeb/?token=${token}&time=${time}&isAppH5=${isAPP}`"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: uni.getStorageSync('TOKEN'),
				time: uni.getStorageSync('LOGIN_TIME'),
				isAPP: true,
				shows: false,
			};
		},
		onNavigationBarButtonTap() {
			if (this.$api.isLogin()) {
				uni.showToast({
					title: '请勿重复登录',
					icon: 'none',
					position: 'bottom'
				})
				return false;
			}
			uni.navigateTo({
				url: '../../../login/login'
			});
		},
		onShow() {
			this.token = uni.getStorageSync('TOKEN');
			this.time = uni.getStorageSync('LOGIN_TIME');
			setTimeout(() => {
				this.shows = true;
			}, 50)
		}
	}
</script>

<style lang="scss">

</style>
