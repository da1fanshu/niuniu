<template>
	<view class="content">
		<scroll-view :style="{ height: '100%' }" scroll-y @scrolltolower="load">
			<view class="index_banner">
				<swiper style="height: 307upx; background: #03BCC0;" :autoplay="true" :circular="true" :interval="5000" :duration="1000">
					<swiper-item v-for="(item, index) in IMGLIST" :key="index">
						<view class="swiper-item"><image :lazy-load="true" :src="item.imageAddress" style="width: 100%; height: 307upx;" mode=""></image></view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item"><image :lazy-load="true" src="/static/banner1.gif" style="width: 100%; height: 307upx;" mode=""></image></view>
					</swiper-item>
					<swiper-item v-if="!IMGLIST[0]"><uni-load-more color="#fff" status="loading"></uni-load-more></swiper-item>
				</swiper>
			</view>
			<view class="newNotice_main">
				<view class="newNotice_main_main">
					<view class="newNotice_main_title clear">
						<text class="fl ll" :class="type == 'TOP' ? 'active' : ''" @click="type = 'TOP'">资讯</text>
						<text class="fl rr" :class="type == 'NOTICE' ? 'active' : ''" @click="type = 'NOTICE'">公告</text>
					</view>
					<view class="newNotice_news">
						<view class="uni-timeline">
							<block v-for="(item, index) in list" :key="index">
								<view
									class="uni-timeline-item"
									:class="[index == 0 ? 'uni-timeline-first-item' : '', index == list.length - 1 ? 'uni-timeline-last-item' : '']"
									@click="$goPage('../newInfo/newDetails/newDetails?id=' + item.id)"
								>
									<view class="uni-timeline-item-divider"></view>
									<view class="uni-timeline-item-content">
										<view class="datetime">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm') }}</view>
										<view class="title">{{ item.title }}</view>
										<view class="text">{{ item.summary }}</view>
										<view class="more">更多&gt;&gt;</view>
									</view>
								</view>
							</block>
							<uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
						</view>
					</view>
				</view>
			</view>
			<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
		</scroll-view>
	</view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
import service from '../service.js';
import { mapGetters } from 'vuex';
export default {
	components: {
		HMmessages,
		uniLoadMore
	},
	computed: {
		...mapGetters(['IMGLIST'])
	},
	data() {
		return {
			pageNo: 1,
			pageSize: 10,
			list: [],
			loading: true,
			noData: false,
			type: 'TOP'
		};
	},
	watch: {
		type() {
			this.list = [];
			this.noData = false;
			this.pageNo = 1;
			this.getNewList();
		}
	},
	mounted() {
		this.getNewList();
	},
	methods: {
		//获取公告资讯
		getNewList() {
			let that = this;
			this.loading = true;
			service
				.getNewList({
					type: this.type,
					pageNo: this.pageNo,
					pageSize: this.pageSize
				})
				.then(({ data }) => {
					this.loading = false;
					if (data.code == '100200') {
						data.data.records.map((e, i) => {
							if (e.articleCover.indexOf('/bera-manage/news/') > -1) {
								e.articleCover = that.$api.baseUrl + e.articleCover;
							}
						});
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
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
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
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
