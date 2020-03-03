<template>
	<view class="content">
		<view class="distribute">
			<view class="leve" @click="goback()"><uni-icons type="arrowleft" size="25" color="#fff"></uni-icons></view>
			<view style="height: 380rpx"></view>
			<view class="coin_number clear">
				<view class="fl">
					<text>总币数量</text>
				</view>
				<view class="fr">
					<input class="inputs" type="digit" :maxlength="maxNumberLnegth" v-model="coinNumber" placeholder="0.0000" />
					<view class="select">
						<picker @change="setCoin" :value="value" :range="coinList" :range-key="'assetCode'">
							<view class="uni-input">{{ coinList[value] ? coinList[value].assetCode : '' }}</view>
						</picker>
						<view class="downs"><uni-icons type="arrowdown" size="20" :color="'#03bcc0'"></uni-icons></view>
					</view>
				</view>
			</view>
			<view class="coin_money clear">
				<text style="color: #fff;font-size: ;">可用：{{ filter.fix(money, 4) }}</text>
			</view>
			<view class="coin_number clear">
				<view class="fl"><text>红包个数</text></view>
				<view class="fr"><input class="inputs" style="width: 100%;" type="number" v-model="number" placeholder="红包个数(最多30个)" /></view>
			</view>
			<view class="submits"><button @click="submits(false)">塞进红包</button></view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
		<!-- 密码输入 -->
		<Modal :title="'发红包'" :background="'#FD6760'" :color="'#FE5A4C'" :isMask="true" v-if="showPush" @close="closeModal('showPush')">
			<view class="common_model">
				<view class="common_form">
					<view class="item clear">
						<view class="fl" style="width: 100%;">数量：{{ coinNumber }} {{ coinList[value] ? coinList[value].assetCode : '' }}</view>
					</view>
					<view class="item clear">
						<view class="fr" style="width: 100%;"><input style="color: #000;" type="password" v-model="pwd" placeholder="请输入资金密码" /></view>
					</view>
				</view>
				<view class="common_btn"><button style="background: #FD6760;" class="active" @click="submits(true)">确定</button></view>
			</view>
		</Modal>

		<view class="flex_row_c_c modalView" :class="qrShow ? 'show' : ''" @tap="hideQr()">
			<view class="flex_column">
				<view class="backgroundColor-white padding1vh border_radius_10px"><image :src="poster.finalPath" mode="widthFix" class="posterImage"></image></view>
				<view class="flex_row marginTop2vh">
					<!-- #ifdef H5 -->
					<template v-if="is_weixin">
						<a class="d_img" :href="poster.finalPath">请长按保存或者分享给好友</a>
					</template>
					<template v-else>
						<a class="d_img" :href="poster.finalPath" download="红包.jpg">保存图片</a>
					</template>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<button type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
					<button type="primary" size="mini" @tap.prevent.stop="share()">分享图片</button>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<view class="hideCanvasView">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{ width: (poster.width || 0) + 'px', height: (poster.height || 0) + 'px' }"></canvas>
		</view>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import comSvc from '@/common/comSvc.js';
import filter from '@/common/filter.js';
import service from '../service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import Modal from '@/components/lkex-modal/index.vue';
import _app from '@/util/QS-SharePoster/app.js';
import getSharePoster from '@/util/QS-SharePoster/QS-SharePoster.js';
export default {
	components: {
		uniIcons,
		HMmessages,
		Modal
	},
	data() {
		return {
			filter,
			coinNumber: '',
			number: '',
			value: 0,
			coinList: [],
			money: 0,
			asset: [],
			showPush: false,
			pwd: '',
			maxNumberLnegth: -1,
			desc: '恭喜发财，大吉大利',
			poster: {},
			qrShow: false,
			canvasId: 'default_PosterCanvasId',
			redCode: '',
			redId: '',
			is_weixin: false
		};
	},
	watch: {
		coinNumber(val) {
			this.setMaxLength('coinNumber', val, 'maxNumberLnegth');
		}
	},
	onLoad() {
		this.getAsset();
		// #ifdef H5
		let is_weixin = (function() {
			return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
		})();
		if (is_weixin) {
			this.is_weixin = true;
		}
		// #endif
	},
	methods: {
		// 海报图专用
		async shareFc() {
			try {
				if (!this.poster.finalPath) {
					let that = this;
					const d = await getSharePoster({
						type: 'testShareType',
						// #ifdef APP-PLUS
						backgroundImage: 'http://whole.nnex.io/redWin.jpg',
						// #endif
						posterCanvasId: this.canvasId,
						qrCodeArray: ({ bgObj, type, bgScale }) => {
							return [
								{
									text: `http://nnex.io/#/?redCode=${that.redId}&type=red`, //生产环境
									size: bgObj.width * 0.3,
									dx: bgObj.width * 0.05,
									dy: bgObj.height - bgObj.width * 0.35,
									image: '/static/codeIcon.png'
								}
							];
						},
						textArray: ({ bgObj, type, bgScale }) => {
							const fontSize = bgObj.width * 0.055;
							const lineHeight = bgObj.height * 0.04;
							return [
								{
									text: `红包码：${that.redCode}`,
									size: fontSize,
									color: '#000',
									textAlign: 'left',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										// _app.log('index页面的text的infocallback ，textlength:' + textLength);
										return {
											dx: bgObj.width - textLength - fontSize,
											dy: bgObj.height - lineHeight
										};
									}
								}
							];
						},
						setCanvasWH: ({ bgObj, type, bgScale }) => {
							// 为动态设置画布宽高的方法，
							this.poster = bgObj;
						}
					});
					// console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath);
					this.poster.finalPath = d.poster.tempFilePath;
				}
				this.qrShow = true;
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
				// console.log(JSON.stringify(e));
			}
		},
			
		goback() {
			uni.navigateBack()
		},
		
		saveImage() {
			// #ifndef H5
			uni.saveImageToPhotosAlbum({
				filePath: this.poster.finalPath,
				success(res) {
					_app.showToast('保存成功');
				}
			});
			// #endif
			// #ifdef H5
			_app.showToast('保存成功');
			// #endif
		},
		share() {
			// #ifdef APP-PLUS
			_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
			// #endif

			// #ifndef APP-PLUS
			_app.showToast('分享成功');
			// #endif
		},
		hideQr() {
			this.qrShow = false;
		},
		// 海报图专用-end

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
		//派发
		submits(bool) {
			if (!this.veif()) {
				return false;
			}
			if (!bool) {
				this.showPush = true;
				return false;
			}
			if (!this.pwd) {
				this.errors('请输入资金密码');
				return false;
			}
			this.$api.showLoading();
			service
				.provided(
					{
						assetCode: this.coinList[this.value].assetCode,
						assetAmount: this.coinNumber,
						gainNum: this.number,
						desc: this.desc
					},
					{
						'pay-password': this.pwd
					}
				)
				.then(({ data }) => {
					this.$api.hideLoading();
					if (data.code == '100200') {
						this.redId = data.data.paperId;
						this.redCode = data.data.randomCode;
						this.closeModal('showPush');
						this.HMmessages.show('红包派发成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
						uni.showModal({
							title: '提示',
							content: '红包派发成功，是否分享？(IOS用户请手动保存到相册)',
							confirmText: '分享',
							success: res => {
								if (res.confirm) {
									this.shareFc();
								}
							}
						});
					} else {
						this.errors(data.msg);
					}
				});
		},
		//验证
		veif() {
			if (!this.coinNumber || !Number(this.coinNumber) || this.coinNumber < 0) {
				this.errors('请输入正确的总币数量');
				return false;
			}
			if (!this.number || !Number(this.number) || this.coinNumber < 0) {
				this.errors('请输入正确的红包个数');
				return false;
			}
			if (!this.money || this.number <= 0) {
				this.errors('资产可用余额不足');
				return false;
			}
			return true;
		},
		//获取用户资产
		getAsset() {
			this.$api.showLoading();
			comSvc.getAssets().then(({ data }) => {
				this.$api.hideLoading();
				if (data.code == '100200') {
					this.asset = data.data;
					this.coinList = data.data;
					this.asset.map((e, i) => {
						if (e.assetCode == data.data[0].assetCode) {
							this.money = e.amountAvailable;
						}
					});
				} else {
					this.errors(data.msg);
				}
			});
		},
		//关闭弹窗
		closeModal(name) {
			this.pwd = '';
			this[name] = false;
			this.coinNumber = '';
			this.number = '';
		},
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		setCoin(e) {
			this.value = e.target.value;
			this.asset.map((e, i) => {
				if (e.assetCode == this.coinList[this.value].assetCode) {
					this.money = e.amountAvailable;
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
