<template>
	<view class="content">
		<view class="authentication">
			<view class="com_header">
				<view class="one">
					<view @click="step='0'" class="h_block"><image src="../../static/account/id_a1.png" mode=""></image></view>
					<view class="a_line"></view>
					<view @click="step='1'" class="h_block">
						<image v-if="step != '0'" src="../../static/account/id_b1.png" mode=""></image>
						<image v-if="step == '0'" src="../../static/account/id_b2.png" mode=""></image>
					</view>
					<view class="a_line"></view>
					<view class="h_block">
						<image v-if="isLevel == true" src="../../static/account/id_c1.png" mode=""></image>
						<image v-if="isLevel == false" src="../../static/account/id_c2.png" mode=""></image>
					</view>
				</view>
				<view class="two">
					<text class="active">基本信息</text>
					<text :class="step=='1'?'active':''">证件照上传</text>
					<text :class="isLevel == true?'active':''">提交审核</text>
				</view>
			</view>
			<view class="g_line"></view>
			<template v-if="isLevel == false">
				<view class="authentication_form" v-if="step == '0'">
					<view class="a_input">
						<text>姓名：</text>
						<input class="uni-input" type="text" value="" placeholder-class="uni-place" placeholder="请输入姓名" />
					</view>
					<view class="a_input" style="justify-content:start;">
						<text>性别：</text>
						<view style="margin-left: -16rpx;">
							<radio-group class="radios" @change="setSex">
								<label class="radio" style="padding-right: 40rpx;font-weight: bold;">
									<radio style="transform:scale(0.6);padding-right: 16rpx;line-height: 2;" color="#488FD3" value="MALE" />
									男
								</label>
								<label class="radio" style="padding-right: 0;font-weight: bold;">
									<radio style="transform:scale(0.6);padding-right: 16rpx;line-height: 2;" color="#488FD3" value="FEMALE" />
									女
								</label>
							</radio-group>
						</view>
					</view>
					<picker mode="date" :value="date" @change="bindDateChange($event, 'date')">
						<view class="a_input">
							<view class="s_input">
								<text>出生日期：</text>
								<view>{{ date }}</view>
							</view>
							<uni-icons style="margin-right: -11rpx;" type="arrowright" :color="'#C5CFD5'" size="22"></uni-icons>
						</view>
					</picker>
					<picker @change="setCertificates" :value="certificates" :range="certificatesList" :range-key="'label'">
						<view class="a_input">
							<view class="s_input">
								<text>证件类型：</text>
								<view>{{ certificatesList[certificates].label }}</view>
							</view>
							<uni-icons style="margin-right: -11rpx;" type="arrowright" :color="'#C5CFD5'" size="22"></uni-icons>
						</view>
					</picker>
					<view class="a_input">
						<text>证件号码：</text>
						<input class="uni-input" type="idcard" placeholder-class="uni-place" v-model="cardNumber" placeholder="请输入证件号码" />
					</view>
					<picker mode="date" :value="endDate" @change="bindDateChange($event, 'endDate')">
					<view class="a_input">
						<view class="s_input">
							<text>到期日期：</text>
							<view>{{ endDate }}</view>
						</view>
						<uni-icons style="margin-right: -11rpx;" type="arrowright" :color="'#C5CFD5'" size="22"></uni-icons>
					</view>
					</picker>
					<picker @change="bindPickerChange" :value="values" :range="addressList" :range-key="'cn'">
					<view class="a_input">
						<view class="s_input">
							<text>国家地区：</text>
							<view>{{ addressList[values].cn }}</view>
						</view>
						<uni-icons style="margin-right: -11rpx;" type="arrowright" :color="'#C5CFD5'" size="22"></uni-icons>
					</view>
					</picker>
					<view class="next" @click="step = '1'">下一步</view>
				</view>
				<view class="authentication_upload" v-if="step == '1'">
					<template v-if="certificates == 0">
						<view class="f_flex">
							<view>
								<view class="upload_img" :class="ID_JUST ? '' : 'JUST'">
									<block v-if="ID_JUST"><image :src="ID_JUST_URL" class="image"></image></block>
									<image class="upload_img_submit" @click="upload('ID_JUST_URL', 'ID_JUST')" src="../../static/dev/phone.png" mode=""></image>
								</view>
								<view class="upload_title">请上传身份证正面</view>
							</view>
							<view>
								<view class="upload_img BACK" :class="ID_BACK ? '' : 'BACK'">
									<block v-if="ID_BACK"><image :src="ID_BACK_URL" class="image"></image></block>
									<image class="upload_img_submit" @click="upload('ID_BACK_URL', 'ID_BACK')" src="../../static/dev/phone.png" mode=""></image>
								</view>
								<view class="upload_title">请上传身份证背面</view>
							</view>
						</view>
						<view class="lst">
							<view>
								<view class="upload_img HOLD" :class="ID_HOLD ? '' : 'HOLD'">
									<block v-if="ID_HOLD"><image :src="ID_HOLD_URL" class="image"></image></block>
									<image class="upload_img_submit" @click="upload('ID_HOLD_URL', 'ID_HOLD')" src="../../static/dev/phone.png" mode=""></image>
								</view>
								<view class="upload_title">请上传手持身份证照片</view>
							</view>
						</view>
					</template>

					<template v-else>
						<view class="f_flex">
							<view>
								<view class="upload_img" :class="ID_PASSPROT ? '' : 'ID_PASSPROT'">
									<block v-if="ID_PASSPROT"><image :src="ID_PASSPROT_URL" class="image"></image></block>
									<image class="upload_img_submit" @click="upload('ID_PASSPROT_URL', 'ID_PASSPROT')" src="../../static/dev/phone.png" mode=""></image>
								</view>
								<view class="upload_title">请上传护照证件照</view>
							</view>
							<view>
								<view class="upload_img HOLD" :class="ID_HOLD ? '' : 'ID_PASSPROTHOLD'">
									<block v-if="ID_HOLD"><image :src="ID_HOLD_URL" class="image"></image></block>
									<image class="upload_img_submit" @click="upload('ID_HOLD_URL', 'ID_HOLD')" src="../../static/dev/phone.png" mode=""></image>
								</view>
								<view class="upload_title">请上传手持护照证件照</view>
							</view>
						</view>
					</template>
				</view>
				<view class="g_line"></view>
				<view class="authentication_submit" v-if="step == '1'">
					<view v-if="loading == false" @click="submits()">提交</view>
					<view :loading="true" v-else style="opacity: 0.5;">提交</view>
				</view>
			</template>
			<view class="b_title" v-if="step == '1'">
				<text style="color: #1882D4;font-size: 28rpx;">请确保证件上传之前满足以下条件：</text>
				<text>1.ID页面必须为原版数字版本</text>
				<text>2.它可以为数码相机拍摄的照片或扫描件</text>
				<text>3.不能超过2MB</text>
				<text>4.您可以上传JPG/JPEG/PNG/BMP/PDF格式的文件，</text>
				<text>任何 不清楚、篡改过、低分辨率或质量差的图像都将被拒绝。</text>
			</view>
			<template v-if="isLevel == true">
				<view class="authentication_lv">
					<view class="lv_top">
						<image v-if="userInfo.auditStatus == 'INIT'" src="../../static/account/wait.png" mode=""></image>
						<image v-else src="../../static/account/fail.png" mode=""></image>
						<template v-if="userInfo.auditStatus == 'INIT'">
							<text>您提交的信息正在审核中</text>
							<text>请耐心等候...</text>
						</template>
						<template v-else>
							<text>您提交的信息审核不通过</text>
							<text>请返回重新提交</text>
						</template>
					</view>
					<view class="lv_bottom">
						<view @click="reset">重新提交</view>
					</view>
				</view>
			</template>
		</view>
		<uni-popup :h5-top="true" :show="showList" position="middle" mode="fixed" @hidePopup="showList = !showList">
			<scroll-view class="uni-center center-box cityList" scroll-y>
				<view class="uni-list-item" v-for="(item, index) in list" :key="index">{{ item }}</view>
			</scroll-view>
		</uni-popup>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import address from '../../static/js/tel.js';
import { uniPopup } from '@dcloudio/uni-ui';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from './service.js';
import { REG_ID } from '@/common/reg.js';
import errList from './err.js';
export default {
	components: {
		uniIcons,
		uniPopup,
		HMmessages
	},
	data() {
		return {
			showList: false,
			loading: false,
			list: [
				'孟加拉国',
				'白俄罗斯',
				'玻利维亚',
				'布隆迪',
				'中非共和国',
				'刚果民主共和国',
				'科特迪瓦（科特迪瓦）',
				'古巴',
				'厄瓜多尔',
				'伊朗',
				'伊拉克',
				'朝鲜',
				'吉尔吉斯斯坦',
				'黎巴嫩',
				'利比亚',
				'缅甸',
				'索马里',
				'苏丹',
				'叙利亚',
				'美属维尔京群岛',
				'美国',
				'委内瑞拉',
				'也门',
				'津巴布韦'
			],
			values: 0,
			addressList: address,
			showPicker: false,
			date: '1980-01-01',
			endDate: this.$formta(new Date(), 'yyyy-MM-dd'),
			value: '',
			certificates: 0,
			certificatesList: [
				{
					type: 'ID_CARD',
					label: '身份证'
				},
				{
					type: 'PASSPORT',
					label: '护照'
				}
			],
			cardNumber: '',
			sex: '',
			ID_JUST: '',
			ID_BACK: '',
			ID_HOLD: '',
			ID_PASSPROT: '',
			ID_PASSPROT_CN: '',
			ID_JUST_URL: '',
			ID_BACK_URL: '',
			ID_HOLD_URL: '',
			ID_PASSPROT_URL: '',
			ID_PASSPROT_CN_URL: '',
			isLevel: false,
			isAgree: true,
			userInfo: {},
			step: '0'
		};
	},
	created() {
		this.authenticationInfo();
	},
	methods: {
		//错误信息格式化
		errText(id) {
			for (let i of errList) {
				if (i.ID == id) {
					return i.cn;
				}
			}
			return id;
		},
		//重新认证
		reset() {
			if (this.userInfo.auditStatus != 'INIT') {
				this.isLevel = false;
			}
		},
		//查询用户基本信息
		authenticationInfo() {
			uni.showLoading({
				title: '加载中...'
			});
			service.authenticationInfo().then(({ data }) => {
				uni.hideLoading();
				if (data.code == '100200') {
					if (data.data.userIdentification && data.data.userIdentification.auditStatus) {
						this.userInfo = data.data.userIdentification;
						if (data.data.userIdentification.auditStatus == 'INIT' || data.data.userIdentification.auditStatus == 'FAIL') {
							this.isLevel = true;
						} else if (data.data.userIdentification.auditStatus == 'OK') {
							this.isLevel = 'OK';
						}
					} else {
						this.isLevel = false;
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: data.msg,
						position: 'bottom'
					});
				}
			});
		},
		//提交审核
		submits() {
			if (!this.veif()) {
				return false;
			}
			let params = {
				userBasicInfoDto: {
					firstName: '',
					middleName: '',
					lastName: this.value,
					gender: this.sex,
					birthday: this.date,
					countryId: this.addressList[this.values].short,
					country: this.addressList[this.values].cn
				},
				identificationDto: {
					countryId: this.addressList[this.values].short,
					country: this.addressList[this.values].cn,
					cardType: this.certificates == 0 ? 'ID_CARD' : 'PASSPORT',
					cardNo: this.cardNumber,
					expiredDate: this.endDate,
					cardPhoto: this.certificates == 0 ? [this.ID_JUST, this.ID_BACK] : [this.ID_PASSPROT],
					cardHandhold: [this.ID_HOLD],
					cardTranslate: this.ID_PASSPROT_CN ? [this.ID_PASSPROT_CN] : []
				}
			};
			this.loading = true;
			service
				.checkId({
					idNum: this.cardNumber
				})
				.then(({ data }) => {
					if (data.code == '100200') {
						service.level1Auth(params).then(({ data }) => {
							this.loading = false;
							if (data.code == '100200') {
								let that = this;
								this.HMmessages.show('提交审核成功，请等待客服人员审核', {
									textAlign: 'center',
									background: '#356e36',
									fontColor: '#fff',
									callback: () => {
										that.back();
									}
								});
							} else {
								this.errors(data.msg);
							}
						});
					} else {
						this.loading = false;
						this.errors(data.msg);
					}
				});
		},
		//设置性别
		setSex(e) {
			this.sex = e.target.value;
		},
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		//上传图片
		upload(name, imgName) {
			let that = this;
			uni.chooseImage({
				count: 1, //默认9
				success: function(res) {
					if (res.tempFiles[0].size * 1 > 2097152) {
						that.errors('图片大小超过2MB，请重新选择');
						return false;
					}
					uni.showLoading({
						title: '上传中...',
						mask: true
					});
					uni.uploadFile({
						url: that.$api.baseUrl + '/exchangeApi/common/upload-photo/private', //仅为示例，非真实的接口地址
						filePath: res.tempFilePaths[0],
						name: 'file',
						formData: {
							'Content-Type': 'image/jpeg;'
						},
						header: {
							authorization: 'token=' + uni.getStorageSync('TOKEN'),
							'accept-language': 'zh-CN'
						},
						success: data => {
							uni.hideLoading();
							let resData = JSON.parse(data.data);
							if (resData.code == '100200') {
								that[name] = res.tempFilePaths[0];
								that[imgName] = resData.data.name;
							} else {
								that.errors(resData.msg);
							}
						},
						fail: err => {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '网络异常，请稍后重试',
								position: 'bottom'
							});
						}
					});
				}
			});
		},
		//设置证件类型
		setCertificates(e) {
			this.certificates = e.target.value;
		},
		//设置日期
		bindDateChange(e, name) {
			this[name] = e.target.value;
		},
		//设置国家地区
		bindPickerChange(e) {
			this.values = e.target.value;
		},
		//验证信息
		veif() {
			if (!this.value) {
				this.errors('请输入姓名');
				return false;
			}
			if (!this.date) {
				this.errors('请选择出生日期');
				return false;
			}
			if (!this.cardNumber) {
				this.errors('请输入证件号码');
				return false;
			}
			if (this.certificates == 0) {
				if (!REG_ID.test(this.cardNumber)) {
					this.errors('请输入正确的证件号码');
					return false;
				}
			}
			if (!this.endDate) {
				this.errors('请选择证件到期日期');
				return false;
			}
			if (this.certificates == 0) {
				if (!this.ID_JUST) {
					this.errors('请上传身份证正面照');
					return false;
				}
				if (!this.ID_BACK) {
					this.errors('请上传身份证背面照');
					return false;
				}
			} else {
				if (!this.ID_PASSPROT) {
					this.errors('请上传护照证件照');
					return false;
				}
			}
			if (!this.ID_HOLD) {
				this.errors('请上传手持证件照');
				return false;
			}
			if (this.isAgree == false) {
				this.errors('请同意承诺说明');
				return false;
			}
			return true;
		},
		//修改手机返回
		back() {
			let length = getCurrentPages();
			if (length.length == 1) {
				uni.switchTab({
					url: '../account/account'
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
