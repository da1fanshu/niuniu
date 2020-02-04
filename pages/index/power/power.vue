<template>
	<view class="content">
		<web-view :src="`http://pool.lkex.co/#/?token=${token}&uid=${uid}&tokens=${tokens}`"></web-view>
	</view>
</template>

<script>
	import service from '../service.js';
	export default {
		data() {
			return {
				token: '',
				tokens: '',
				uid:'',
			};
		},
		onShow() {
			this.tokens = uni.getStorageSync('TOKEN');
			this.getCloudInfo();	
		},
		onNavigationBarButtonTap() {
			uni.switchTab({
				url: '../../index/index'
			});
		},
		methods: {
			getCloudInfo() {
				service
					.getCloudInfo()
					.then(({ data }) => {
						if (data.code == '100200') {
							this.token = data.data.token;
							this.uid = data.data.uid;
						} else {
							this.errors(data.msg);
						}
					});
			},
		}
	}
</script>

<style lang="scss">
	.content {
		background: rgba(238, 238, 238, 0.5)
	}
</style>
