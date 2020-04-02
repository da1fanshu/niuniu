<script>
export default {
	onLaunch: function() {
		// #ifdef APP-PLUS
		// plus.screen.lockOrientation('portrait-primary'); //锁定
		// 监听点击消息事件
		// plus.push.addEventListener(
		//   'click',
		//   function(msg) {
		//     var payload = plus.os.name == 'iOS' ? msg.payload : JSON.parse(msg.payload);
		//   },
		//   false
		// );

		// 监听在线消息事件
		// plus.push.addEventListener(
		//   'receive',
		//   function(msg) {
		//     logoutPushMsg(msg);
		//   },
		//   false
		// );

		//获取穿透参数
		function logoutPushMsg(msg) {
			if (msg.payload) {
				if (typeof msg.payload == 'string') {
					createLocalPushMsg(msg.content);
				} else {
					var data = JSON.parse(msg.payload);
					createLocalPushMsg(data.content);
				}
			} else {
			}
		}

		//获取推送透传的数据
		function createLocalPushMsg(content) {
			let data = JSON.parse(content);
			if (data.url.indexOf('articleDetails') > -1) {
				let Url = data.url.split('?');
				uni.navigateTo({
					url: `/pages/index/newInfo/newDetails/newDetails?${Url[1]}`
				});
			}
			// console.log(JSON.stringify(data));
			// that.$router.push("/" + data.url);
			// var options = { cover: true };
			// plus.push.createMessage(content, "LocalMSG", options);
			// if (plus.os.name == "iOS") {
			//   alert('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
			// }
		}
		// #endif
	},
	onShow: function() {
		// #ifdef APP-PLUS
		let that = this;
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			// inf.version;
			that.$store.commit('setVersion', inf);
		});
		// #endif
	},
	onHide: function() {}
};
</script>

<style lang="scss">
@font-face {
	font-family: 'iconfont';
	src: url('~@/static/font/iconfont.ttf');
}
.NavBar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 26rpx;
	height: 88rpx;
	background-color: rgb(29, 34, 67);
	color: rgb(255, 255, 255);
	text {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}
	image {
		width: 32rpx;
		height: 32rpx;
	}
}
.none {
	margin: 74rpx auto 10rpx;
	image {
		width: 100rpx;
		height: 100rpx;
		display: block;
		margin: auto;
		margin-left: 310rpx;
	}
	view {
		text-align: center;
		font-weight: bold;
		color: #C5CFD5;
		font-size: 24rpx;
		margin-top: 24rpx;
	}
}
.self {
	width:198rpx;
	height:66rpx;
	background:rgba(255,255,255,1);
	border:2rpx solid rgba(197,207,213,1);
	border-radius:10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: $blue;
	font-weight: bold;
	margin: auto;
	margin-top: 62rpx;
}
.a_input {
	padding: 0 12rpx;
	border-bottom: 2rpx solid #e7ebee;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	.s_input {
		display: flex;
		align-items: center;
		view {
			font-weight: bold;
			font-size: 32rpx;
		}
	}
	text {
		font-weight: bold;
		display: block;
		font-size: 32rpx;
		width: 220rpx;
	}
	input {
		display: block;
		font-size: 32rpx;
		width: calc(100% - 220rpx);
		font-weight: bold;
	}
	.send {
		position: absolute;
		right: 16rpx;
		button {
			color: $blue;
			font-size: 32rpx;
			font-weight: bold;
			border: none;
			padding: 0;
		}
	}
}
.pla {
	color: #C5CFD5;
}
.g_block {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 66rpx;
	background: #F8F9FB;
	font-weight: bold;
	border-radius: 6rpx;
	width: 100%;
	.g_left {
		font-size: 32rpx;
		margin-left: 22rpx;
	}
	.g_right {
		display: flex;
		align-items: center;
		margin-right: 22rpx;
		text {
			color: #C5CFD5;
		}
	}
}
.c_block {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx 0 48rpx;
	border-bottom: 2rpx solid #e7ebee;
	height: 100rpx;
	.set {
		font-size: 32rpx;
		color: #c5cfd5;
	}
	.f_flex {
		display: flex;
		align-items: center;
	}
	.left {
		display: flex;
		align-items: center;
		image {
			width: 44rpx;
			height: 44rpx;
			margin-right: 18rpx;
		}
		text {
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	.right {
		display: flex;
		align-items: center;
		view {
			color: #c5cfd5;
		}
	}
}
.blue_btn {
	width: 700rpx;
	height: 66rpx;
	background: rgba(24, 130, 212, 1);
	border-radius: 6rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-weight: bold;
	margin: auto;
}
.iconfont {
	font-family: iconfont;
}

@import url('/components/gaoyia-parse/parse.css');

.uni-mask {
	z-index: 997 !important;
}

.uni-popup {
	padding: 0 !important;
	background: none !important;
}
page-head-btn {
	margin-right: 24rpx;
}
textarea {
	height: 100%;
	width: 100%;
}

uni-input div {
	width: 100%;
}

page {
	display: flex;
	flex: 1;
	background-color: $appBg;
	min-height: 100%;
	position: relative;
}

/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';

/*每个页面公共css */
.down_app {
	position: fixed;
	bottom: 50px;
	left: 0;
	right: 0;
	padding-left: 20rpx;
	height: 80rpx;
	line-height: 80rpx;
	background: rgba(0, 0, 0, 0.7);
	color: #fff;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	text {
		color: #fff;
	}
	.fl {
		width: calc(100% - 80rpx);
	}
}

.content {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: auto;
	min-height: 100%;
}

.status_bar {
	height: var(--status-bar-height);
	width: 100%;
	background-color: #191e2a;
}

.top_view {
	height: var(--status-bar-height);
	width: 100%;
	position: fixed;
	background-color: #191e2a;
	top: 0;
	z-index: 999;
}

.clear:after {
	content: ''; //设置内容为空
	height: 0; //高度为0
	line-height: 0; //行高为0
	display: block; //将文本转为块级元素
	visibility: hidden; //将元素隐藏
	clear: both; //清除浮动
}

.fl {
	float: left;
}

.fr {
	float: right;
}

.icon-cion {
	display: inline-block;
	// background-image: url('https://whole.winmax.me/bch@2x.png');
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain; // ipt
}

.common_model {
	.model_input {
		width:526rpx;
		height:66rpx;
		background:#E7EBEE;
		display: flex;
		align-items: center;
		margin: 88rpx auto;
		input {
			padding-left: 52rpx;
		}
		.model_pla {
			color: #C5CFD5;
		}
	}
	.center_model {
		padding: 40rpx 0;
		.l_input {
			padding: 0 82rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-weight: bold;
			position: relative;
			margin-bottom: 32rpx;
			&:last-child {
				margin-bottom: 0;
			}
			.pla {
				color: #C5CFD5;
			}
			.send {
				position: absolute;
				right: 102rpx;
				button {
					color: $blue;
					font-size: 28rpx;
					border: none;
					padding: 0;
				}
			}
			input {
				width:180px;
				height:66rpx;
				background:rgba(248,249,251,1);
				border-radius:6rpx;
				padding-left: 20rpx;
			}
		}
		
	}
	.model_text {
		margin: 86rpx 128rpx 110rpx;
		font-weight: bold;
		text-align: left;
		line-height: 1.2;
	}
	.common_btn {
		display: flex;
		view {
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 50%;
			border-top: 2rpx solid #C5CFD5;
			background: #fff;
			border-radius: 0;
			color: #C5CFD5;
			transition: all 0.1s;
			font-weight: bold;
			&::after {
				display: none;
			}
			&.active {
				color: #1F3F59;
				border-left:2rpx solid #C5CFD5 ;
			}
		}
	}
}

// 红包海报
.hideCanvasView {
	position: relative;
}

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}
.flex_row_c_c {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.modalView {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	outline: 0;
	transform: scale(3);
	perspective: 2500upx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out;
	pointer-events: none;
	backface-visibility: hidden;
	z-index: 999;
}

.modalView.show {
	opacity: 1;
	transform: scale(1);
	pointer-events: auto;
}

.flex_column {
	display: flex;
	flex-direction: column;
}

.backgroundColor-white {
	background-color: white;
}

.border_radius_10px {
	border-radius: 10px;
}

.padding1vh {
	padding: 1vh;
}

.posterImage {
	width: 60vw;
}

.flex_row {
	display: flex;
	flex-direction: row;
	.d_img {
		color: #fff;
		text-decoration: none;
		display: inline-block;
		background: #007aff;
		line-height: 2.3;
		font-size: 26rpx;
		border-radius: 10rpx;
		padding: 0 1.34em;
		margin-left: auto;
		margin-right: auto;
	}
}

.marginTop2vh {
	margin-top: 2vh;
}
</style>
