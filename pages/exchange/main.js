import filter from '@/common/filter.js'
import service from './service.js';
import comSvc from '@/common/comSvc.js';
import api from '@/common/api.js'
export default {
  data() {
    return {
      pairs: 'USDK',
      filter,
      coinImgUrl:api.coinImgUrl,
      list: [],
      mainList: [],
      tradeList: [],
	  configList: [],
      loading: true,
      userStart: [],
      Time: null,
	  tether:0,
	  bitcoin:0,
	  ethereum:0,
	  digitalusd:0,
	  cexchange: [
		  {name: "USDK"},
		  {name: "LKB"},
		  {name: "USDT"},
	  ],
    };
  },
  onUnload() {
    clearTimeout(this.Time)
    this.$store.commit('setIsExchange',false);
  },
  onHide() {
    clearTimeout(this.Time)
    this.$store.commit('setIsExchange',false);
  },
  onShow() {
    this.$store.commit('setIsExchange',true);
    this.userStart = uni.getStorageSync('userStart') ? JSON.parse(uni.getStorageSync('userStart')) : [];
    this.loading = true;
    Promise.all([service.getConfigSymbolRank(), comSvc.getTrade(), service.symbolConfigList()]).then((data) => {
      this.loading = false;
      if (data[0].data.code == '100200') {
        this.mainList = data[0].data.data;
        this.tradeList = data[1].data;
		this.configList = data[2].data.data;
		let innerObj;
		for(let key in this.mainList) {
			for (let i = 0; i < this.configList.length; i++) {
				innerObj = this.configList[i];
				if (this.mainList[key].symbol === innerObj.symbol) {
					this.mainList[key][innerObj.profileKey] = innerObj.profileValue;
				}
			}
		}	
		console.log(this.mainList)
        this.list = this.formatTrade(this.formatData(this.mainList))
        this.loopPan()
      } else {
        this.errors(data[0].data.msg);
      }
    }).catch(err => {
      this.loading = false;
    })
	service.getUSDT().then(({
	  data
	}) => {
	  if (data.code == '100200') {
		let regEx = /[^\d|^\.|^\-]/g;
	    for(let i in data.data){	  
	      data.data[i] = data.data[i].replace(regEx,"") * 1;
	    }
	    this.tether = data.data.tether;
		this.bitcoin = data.data.bitcoin;
		this.ethereum = data.data.ethereum;
		this.digitalusd = data.data.digitalusd;
	  }
	})
  },
  watch: {
    pairs(val) {
      this.list = this.formatTrade(this.formatData(this.mainList))
    }
  },
  methods: {
    //轮训盘
    loopPan() {
      if (!this.EXCHANGE) {
        clearTimeout(this.Time)
        return false;
      }
      comSvc.getTrade().then(({
        data
      }) => {
        this.tradeList = data;
        this.Time = setTimeout(() => {
          this.loopPan();
        }, 1000)
        this.list = this.formatTrade(this.formatData(this.mainList))
      })
    },
    //自选交易对
    startSymbol(coin) {
      let userStart = uni.getStorageSync('userStart') ? JSON.parse(uni.getStorageSync('userStart')) : null;
      if (userStart) {
        if (userStart.includes(coin)) {
          Array.prototype.indexOfs = function(val) {
            for (var i = 0; i < this.length; i++) {
              if (this[i] == val) return i;
            }
            return -1;
          };
          Array.prototype.remove = function(val) {
            var index = this.indexOfs(val);
            if (index > -1) {
              this.splice(index, 1);
            }
          }
          userStart.remove(coin);
          uni.setStorageSync('userStart', JSON.stringify(userStart));
        } else {
          userStart.push(coin);
          uni.setStorageSync('userStart', JSON.stringify(userStart));
        }
      } else {
        uni.setStorageSync('userStart', JSON.stringify([coin]))
      }
      this.userStart = uni.getStorageSync('userStart') ? JSON.parse(uni.getStorageSync('userStart')) : [];
    },
    //设置交易币种
    setType(name) {
      this.pairs = name;
    },
    //格式化币种交易数据
    formatTrade(data) {
      data.map((e, index) => {
        for (let i in this.tradeList) {
          if (e.symbol == i) {
            e.trade = this.tradeList[i];
            let pr_ne = this.tradeList[i].newPrice ? this.tradeList[i]['newPrice'] * 1 : 0; // 最新價
            let pr_op = this.tradeList[i].newPrice ? this.tradeList[i]['24Price'] * 1 : 0; // 開盤價
            // 漲跌幅

            let distance = pr_ne - pr_op;
            let symbol = '';
            if (distance < 0) {
              symbol = '-'
            } else if (distance > 0) {
              symbol = '+'
            }
            if ((this.tradeList[i].newPrice ? this.tradeList[i]['24Price'] * 1 : 0) == 0) {
              e.trade.changeRatio = filter.floorFix(0, 2);
            } else {
              e.trade.changeRatio = symbol + filter.floorFix(filter.abs(distance) / pr_op * 100, 2);
            }
            e.trade.changeRatioNum = parseFloat(e.trade.newPrice ? e.trade.changeRatio : 0);
          }
        }
      })
      return data
    },
    //格式化数据
    formatData(data) {
      let arr = [];
      data.map((e, i) => {
        if (this.pairs == 'optional') {
          if (this.userStart.includes(e.symbol) && e.status !== "DELISTED") {
            arr.push(e);
          }
        } else if (e.assetCode1 == this.pairs && e.status !== "DELISTED") {
          arr.push(e);
        }
      })
      return arr;
    },
    //错误提示
    errors(text) {
      this.HMmessages.show(text, {
        textAlign: 'center',
        background: '#74272d',
        fontColor: '#fff'
      });
    },
  },
  filters: {
    lockNum(value) {
      if (value >= 10000) {
        value = Math.round(value / 10000 * 100) / 100 + 'w';
      } else {
        value = value;
      }
      return value;
    }
  }
}
