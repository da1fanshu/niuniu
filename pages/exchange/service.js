import api from '@/common/api.js';
export default {
	//手机号登录
	phoneLogin(data, header) {
		return api.get('/exchangeApi/user/phone-login', data, header)
	},
	//邮箱登录
	emailLogin(data, header) {
		return api.get('/exchangeApi/user/login', data, header)
	},
	//获取交易对信息
	getConfigSymbolRank() {
		return api.get('/exchangeApi/configSymbol-Operate/getConfigSymbolRank');
	},
	//创建买卖订单
	createdOrder(data, header) {
		return api.get('/exchangeApi/match/order', data, header)
	},
	//获取当前委托
	current(data) {
		return api.get('/exchangeApi/match/match-order/current', data)
	},
	//获取历史委托
	history(data) {
		return api.get('/exchangeApi/match/match-order/history', data)
	},
	//取消委托
	cancelOrder(data) {
		return api.get('/exchangeApi/match/match-order/cancel', data)
	},
	//获取USDT价格
	getUSDT() {
		return api.get('/exchangeApi/configSymbol-Operate/getSymbolUsdtPrice');
	},
	/**
	 * 查询所有交易对的配置
	 * @param param
	 * @returns {*}
	 */
	symbolConfigList() {
		return api.get('/exchangeApi/match/symbolprofiles');
	},
}
