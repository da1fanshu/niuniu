import comSvc from '@/common/comSvc.js';
import service from '../service.js';
import filter from '@/common/filter.js';
import _ from '@/common/lodash.js';
import api from '@/common/api.js'
export default {
	data() {
		return {
			coinImgUrl: api.coinImgUrl,
			statesTex: {
				FAIL: '委托失败',
				WAITING: '委托中...',
				CANCEL: '委托取消',
				SUCCESS: '交易成功',
				PROCESSING: '委托中...',
			},
			filter,
			cexchange: [{
					name: "USDK"
				},
				{
					name: "LKB"
				},
				{
					name: "USDT"
				},
			],
			isPayPwd: '',
			pairs: 'USDK',
			title: '',
			coin: '',
			symbol: '',
			showSelect: false,
			type: 'BUY',
			sellList: [],
			buyList: [],
			tradeList: [],
			startDate: this.GetDateStr(30),
			endDate: this.$formta(new Date(), 'yyyy-MM-dd'),
			entrustList: [],
			coinList: [],
			coinMainList: [],
			symbolType: '',
			sale: '',
			average: 0,
			asset: [],
			money: 0,
			price: '',
			number: '',
			isLogin: false,
			numberMaxLength: -1,
			priceMaxLength: -1,
			payPwd: '',
			maxNumber: 0,
			maxPrice: 0,
			pageNo: 1,
			pageSize: 10,
			loading: true,
			noData: false,
			Times: null,
			lastName: 'x',
			panGun: null,
			sellScrollTop: 0,
			buyScrollTop: 0,
			// rangeValues: [2, 5], //当前区间值
			// slideWidth: 350, //宽度
			// slideHeight: 80,  //高度
			// slideBlockSize: 56, //圆形按钮大小
			// slideMin: 0,  //slider最小值
			// slideMax: 12,  //slider最大值
			minValue: 0,
			maxValue: 100,
			rangeValues: [0, 0],
			slideHeight: 80,
			slideWidth: 328,
			slideBlockSize: 45,
			slideMin: 0,
			slideMax: 100
		};
	},
	watch: {
		number(newVal) {
			if (newVal) {
				this.setMaxLength('number', newVal, 'numberMaxLength');
			}
			this.maxPrice = this.price;
		},
		price(newVal) {
			if (newVal && newVal != 0) {
				this.setMaxLength('price', newVal, 'priceMaxLength');
				this.maxNumber = filter.fix(this.money / (this.price ? this.price : 0) * 1, 6);
			} else {
				this.maxNumber = 0;
			}
		},
		pairs(val) {
			this.coinList = this.formatData(this.coinMainList)
		}
	},
	onLoad(option) {
		if (option) {
			this.pairs = option.coin;
			this.title = option.title;
			this.coin = option.coin;
			this.symbol = option.symbol;
			this.symbolType = option.type;
			this.sale = option.sale;
		}
	},
	//卸载轮训
	onUnload() {
		clearTimeout(this.Times)
		this.$store.commit('setIsPan', false);
	},
	//卸载轮训
	onHide() {
		clearTimeout(this.Times)
		this.$store.commit('setIsPan', false);
	},
	onShow() {
		this.backType();
		this.$store.commit('setIsPan', true);
		this.getConfigSymbolRank();
		this.getPan();
		this.getPanInfo();
		this.loopPan();
		if (this.$api.isLogin()) {
			this.isLogin = true;
			this.getAsset();
		} else {
			if (this.type == 'CURRENT' || this.type == 'HISTORY') {
				this.$api.goLogin('../../login/login');
			}
			this.isLogin = false;
		}
	},
	methods: {
		//轮盘查询
		loopPan() {
			if (!this.PAN) {
				clearTimeout(this.Times)
				return false;
			}
			this.getPan();
			this.getPanInfo();
			this.Times = setTimeout(() => {
				this.loopPan();
			}, 1000)
		},
		//前往K线
		goKline(symbolType) {
			this.$goPage(`../kline/kline?type=${this.symbolType}&title=${this.title}&coin=${this.coin}&symbol=${this.symbol}`);
		},
		//重新更改页面
		goPage(url) {
			uni.redirectTo({
				url: url
			})
		},
		//设置要查询的交易对
		setCoin(name) {
			this.pairs = name;
		},
		//查询交易对
		getConfigSymbolRank() {
			service.getConfigSymbolRank().then(({
				data
			}) => {
				if (data.code == '100200') {
					this.coinMainList = data.data;
					this.coinList = this.formatData(this.coinMainList);
				} else {
					this.errors(data.msg);
				}
			})
		},
		//格式化数据
		formatData(data) {
			let arr = [];
			data.map((e, i) => {
				if (e.assetCode1 == this.pairs && e.status !== "INIT" && e.status !== "DELISTED") {
					arr.push(e);
				}
			})
			return arr;
		},
		//取消委托
		cancelOrder(item) {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '是否取消当前委托挂单',
				success(res) {
					if (res.confirm) {
						service
							.cancelOrder({
								symbol: that.symbolType,
								orderNo: item.payTransactionNo
							})
							.then(({
								data
							}) => {
								if (data.code == '100200') {
									that.pageNo = 1;
									that.entrustList = [];
									that.getEntrust();
									that.HMmessages.show('撤单成功', {
										textAlign: 'center',
										background: '#356e36',
										fontColor: '#fff'
									});
								} else {
									that.errors(data.msg);
								}
							});
					}
				}
			});
		},
		//获取委托
		getEntrust() {
			this.loading = true;
			let name = this.type == 'CURRENT' ? 'current' : 'history';
			service[name]({
				symbol: this.symbolType,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				beginTime: this.startDate,
				endTime: this.endDate
			}).then(({
				data
			}) => {
				this.loading = false;
				if (data.code == '100200') {
					data.data.list.map((e, i) => {
						e.coin = e.symbol.split('_')[1];
					})
					this.entrustList = this.entrustList.concat(data.data.list);
					if (data.data.pageNum == 1 || data.data.pageNum == 0) {
						this.noData = true;
						return false;
					}
					if (this.pageNo >= data.data.pageNum) {
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
			this.getEntrust();
		},
		//获取时间
		GetDateStr(AddDayCount) {
			var dd = new Date();
			dd.setDate(dd.getDate() - AddDayCount); //获取AddDayCount天前的日期
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1; //获取当前月份的日期
			var d = String(dd.getDate()).length < 2 ? '0' + dd.getDate() + '' : dd.getDate();
			// var d = dd.getDate();
			return y + '-' + (Number(m + '') < 10 ? '0' + m : m) + '-' + d;
		},
		//买入卖出
		buySell(type, bool) {
			let that = this;
			if (!this.veif()) {
				return false;
			}
			if (!bool) {
				if (this.USERINFO.authLevel == 'LEVEL0') {
					uni.showModal({
						title: '提示',
						content: '请进行实名认证后进行购买',
						confirmText: '前往实名',
						success(res) {
							if (res.confirm) {
								that.$goPage('../../authentication/authentication');
							}
						}
					});
					return false;
				}
				if (!this.USERINFO.setPayPassword) {
					uni.showModal({
						title: '提示',
						content: '请先设置资金密码在进行交易',
						confirmText: '前往设置',
						success(res) {
							if (res.confirm) {
								that.$goPage('../../account/securitySetting/securitySetting');
							}
						}
					});
				}
			}
			if (this.AVOID == 0 && !bool) {
				this.isPayPwd = type;
				return false;
			}
			let params = {
				price: this.price,
				amount: this.number,
				tradeCoinType: type,
				tradeCoinFlag: 'FIXED',
				orderNo: this.$api.outOrder(),
				symbol: this.symbolType
			};
			let header = {
				'pay-password': this.AVOID == 1 ? '%20' : this.payPwd
			};
			this.$api.showLoading();
			service.createdOrder(params, header).then(({
				data
			}) => {
				this.$api.hideLoading();
				if (data.code == '100200') {
					that.price = '';
					that.number = '';
					that.closeModal('isPayPwd');
					that.getAsset();
					this.HMmessages.show('挂单成功', {
						textAlign: 'center',
						background: '#356e36',
						fontColor: '#fff'
					});
				} else {
					this.errors(data.msg);
				}
			});
		},
		//设置百分比
		percentage(number) {
			if (this.type == 'BUY') {
				if (number == 100) {
					this.number = this.maxNumber
				} else {
					this.number = filter.fix(this.maxNumber * (number / 100));
				}
			} else {
				if (number == 100) {
					this.number = this.money
				} else {
					this.number = filter.fix(this.money * (number / 100));
				}
			}
		},
		//设置小数点位数长度
		setMaxLength(name, val, maxName) {
			let precision = 6;
			let arrs = val.split('.');
			let attr0 = arrs[0];
			let attr1 = arrs[1];
			if (attr1) {
				this[name] = attr0 + '.' + attr1.slice(0, precision);
				this[maxName] = attr1.slice(0, precision).length == 6 ? this[name].length : -1;
			} else {
				this[maxName] = -1;
			}
		},
		//点击设置价格
		setPrice(number) {
			this.price = filter.fix(number, 6);
		},
		//获取用户资产
		getAsset() {
			comSvc.getAssets().then(({
				data
			}) => {
				if (data.code == '100200') {
					this.asset = data.data;
					this.asset.map((e, i) => {
						let coin = this.type == 'BUY' ? this.coin : this.symbol;
						if (e.assetCode == coin) {
							this.money = e.amountAvailable;
						}
					});
				} else {
					this.errors(data.msg);
				}
			});
		},
		//获取买卖盘成交记录
		getPanInfo() {
			comSvc
				.getPanInfo({
					symbol: this.symbolType
				})
				.then(({
					data
				}) => {
					this.average = data.order ? data.order[0].price : 0;
					this.tradeList = data.order || [];
				});
		},
		//获取买卖盘数据
		getPan() {
			this.panGun && clearInterval(this.panGun)
			comSvc
				.getBuySell({
					symbol: this.symbolType
				})
				.then(({
					data
				}) => {
					this.sellList = typeof data.sell == 'string' ? [] : FormatData(data.sell).reverse();
					this.buyList = typeof data.buy == 'string' ? [] : FormatData(data.buy);

					function FormatData(prevArr) {
						if (!prevArr[0]) {
							return [0];
						}
						if (prevArr.length > 5) {
							prevArr = prevArr.slice(0, 5);
						}
						let max = _.maxBy(prevArr, 1)[1];
						let newArr_obj = [];
						prevArr.forEach(function(value, index) {
							let width = value[1] / max * 100 + '%';
							newArr_obj.push({
								price: value[0],
								count: value[1],
								width
							})
						});
						return newArr_obj;
					}

					// setTimeout(() => {
					//   if (!this.PAN) {
					//     return false;
					//   }
					//   let view = uni.createSelectorQuery().select('#SELLLIST');
					//   view
					//   .boundingClientRect(data => {
					//     this.sellScrollTop = data.height;
					//   })
					//   .exec();
					//   this.buyScrollTop = 0;
					// }, 100)
				});
		},
		//隐藏币种选择
		hidePopup() {
			this.showSelect = false;
		},
		//修改手机返回
		back() {
			let that = this;
			this.Times && clearInterval(that.Times);
			setTimeout(() => {
				clearInterval(that.Times)
			}, 500)
			let length = getCurrentPages();
			if (length.length == 1) {
				uni.switchTab({
					url: '../../index/index'
				});
			} else {
				uni.navigateBack();
			}
		},
		//设置时间
		bindDateChange(e, name) {
			this[name] = e.target.value;
			this.pageNo = 1;
			this.entrustList = [];
			this.getEntrust();
		},
		//返回类型
		backType() {
			if (this.sale) {
				let name = this.sale;
				this.type = name;
				if (name == 'BUY' || name == 'SELL') {
					this.$store.commit('setIsPan', true);
					this.loopPan();
					this.asset.map((e, i) => {
						let coin = name == 'BUY' ? this.coin : this.symbol;
						if (e.assetCode == coin) {
							this.money = e.amountAvailable;
						}
					});
				} else {
					this.$store.commit('setIsPan', false);
					this.pageNo = 1;
					this.entrustList = [];
					this.getEntrust();
				}
			}
		},
		//设置类型
		setType(name) {
			this.type = name;
			if (name == 'BUY' || name == 'SELL') {
				this.$store.commit('setIsPan', true);
				this.loopPan();
				this.asset.map((e, i) => {
					let coin = name == 'BUY' ? this.coin : this.symbol;
					if (e.assetCode == coin) {
						this.money = e.amountAvailable;
					}
				});
			} else {
				this.$store.commit('setIsPan', false);
				this.pageNo = 1;
				this.entrustList = [];
				this.getEntrust();
			}
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
		veif() {
			if (!this.price || !Number(this.price)) {
				this.errors('请输入正确的价格');
				return false;
			}
			if (!this.number || !Number(this.number)) {
				this.errors('请输入正确的数量');
				return false;
			}
			return true;
		},
		//隐藏弹窗
		closeModal(name) {
			this[name] = '';
			this.payPwd = '';
		}
	}
}
