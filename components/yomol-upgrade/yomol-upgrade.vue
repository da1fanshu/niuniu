<template>
	<view v-if="visible" class="mark">
		<view class="view">
			<text class="title">{{title}}</text>
			<view class="tip">新版更新内容</view>
			<scroll-view class="scroll" scroll-y>
				<view class="item" v-for="(item,index) in contents" :key="index">
					{{item}}
				</view>
			</scroll-view>
			<view v-if="!downloading" class="btns">
				<image class="icon" src="/static/dev/updata.png"></image>
				<view class="sure" @click="onSureClick()">马上升级</view>
			</view>
			<cmd-progress v-else class="progress" type="dashboard" :stroke-color="'#12abb0'" :percent="progress"></cmd-progress>
		</view>
	</view>
</template>

<script>
	import cmdProgress from '@/components/cmd-progress/cmd-progress.vue'
	export default {
		components: {
			cmdProgress
		},
		data() {
			return {
				visible: false,
				progress: 0,
				contents: [],
				downloading: false,
				success: true,
        
          Time:null
			}
		},
		props: {
			type: {
				type: String,
				default: 'pkg'
			},
			url: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '版本更新'
			},
			content: {
				type: String,
				default: ""
			}
		},
		watch: {
			content() {
				var strs = this.content.split('\n')
				for (var i = 0; i < strs.length; i++) {
					this.contents.push(strs[i])
				}
			}
		},
		methods: {
			show() {
				setTimeout(() => {
					if(this.success){
						this.visible = true
					}
				}, 100);
			},
			hide(){
				setTimeout(() => {
					this.visible = false
				}, 100);
			},
			onCancelClick(){
				this.hide()
			},
			onSureClick(){
				var platform = uni.getSystemInfoSync().platform
				if(platform == 'ios' && this.type == 'pkg'){
					plus.runtime.openURL(this.url);
				}else{
					this.downloading = true
					var downloadTask = uni.downloadFile({
						url: this.url,
						success: (downloadResult) => {
							// this.hide()
							if (downloadResult.statusCode === 200) {
								plus.runtime.install(downloadResult.tempFilePath, {
									force: false
								}, function() {
									plus.runtime.restart();
								}, (e) => {
									console.log(e);
									this.success = false
									uni.showToast({
										title: '安装升级包失败，请确认是否开启安装权限',
										icon: 'none',
                    position: 'bottom'
									})
								});
							}else{
                this.downloading = false;
                uni.showToast({
                	title: '网络异常，请稍后重试',
                	icon: 'none',
                  position: 'bottom'
                })
              }
						}
					});
					downloadTask.onProgressUpdate((e)=>{
						this.progress = e.progress
					})
				}
			}
		},
	}
</script>

<style>
	.mark{
		position: fixed;
		top: 0;
		left: 0;
    right: 0;
    bottom: 0;
		background: rgba(0,0,0,0.6);
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	
	.view{
		width: 80vw;
		height: 70vw;
		background-color: white;
		border-radius: 15upx;
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		align-items: center;
	}
	
	.title{
		margin-top: 20upx;
		color: #12abb0;
		font-weight: bold;
		font-size: 38upx;
		text-align: center;
	}
	
	.tip{
		margin-top: 20upx;
		margin-left: 30upx;
		align-self: flex-start;
		font-size: 32upx;
		font-weight: 600;
		color: black;
	}
	
	.scroll{
		width: 100%;
		height: 300upx;
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
	
	.item{
		margin-left: 50upx;
		text-align: left;
		font-size: 30upx;
	}
	
	.btns{
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		margin-bottom: 10upx;
	}
	
	.icon{
		width: 45upx;
		height: 45upx;
		margin-right: 10upx;
	}
	
	.sure{
		padding: 10upx 0;
		text-align: center;
		color: #12abb0;
		font-size: 30upx;
		font-weight: 500;
	}
	
	.progress{
		margin-bottom: 20upx;
	}
	
</style>
