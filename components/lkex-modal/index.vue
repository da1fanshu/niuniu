<template>
	<view>
		<view class="Modal_mask" :class="mClass" @click.stop="closes"></view>
		<view class="Modal_Modal">
			<view class="Modal_title">
				<text class="title" :style="{ color: color }">{{ title }}</text>
			</view>
			<view class="Model_conter"><slot></slot></view>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icon/uni-icon.vue';
export default {
	name: 'lkex-modal',
	components: { uniIcons },
	props: {
		mClass: {
			type: String,
			default: ''
		},
		title: {
			type: String
		},
		color: {
			type: String
		},
		background: {
			type: String
		},
		isShowClose: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {};
	},
	methods: {
		hideModal() {
			if (this.isMask) {
				this.$emit('close');
			}
		},
		closes() {
			this.$emit('close');
		}
	}
};
</script>

<style lang="scss">
.Modal_mask {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 100;
}
.Modal_Modal {
	z-index: 999;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 700rpx;
	background: #fff;
	border-radius: 6upx;
	overflow: hidden;
	.Modal_title {
		position: relative;
		.title {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 36rpx;
			font-weight: bold;
			margin-top: 32rpx;
		}
	}
}

// 红包样式
.luckDraw_modal {
	.Modal_Modal {
		width: 550rpx;
		background: #f25542;
		.Modal_title {
			height: 90rpx;
			.title {
				color: #fde1b1;
				font-size: 32rpx;
			}
	
		}
	}
}
</style>
