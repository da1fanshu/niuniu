import moment from '@/common/moment.js';
import filter from '@/common/filter.js';
import service from '../service.js';
export default {
  data() {
    return {
      isOrederClose: false,
      isSure: false,
      isCoin: false,
      isForce: false,
      filter,
      type: 'UNPAY', //UNPAY,PAID,COMPLETED,COMPLAINNING
      region: 'SELL', //PURCHASE,SELL
      userType: 'ordinary', //ordinary,member
      loading: true,
      list: [],
      c2cTransOrderType: '',
      pageNo: 1,
      pageSize: 10,
      itemObj: {},
      noData: false,
      payPwd: '',
    };
  },
  onLoad(option) {
    if (option && option.type && option.orderType && option.user) {
      this.region = option.orderType;
      this.userType = option.user;
      this.c2cTransOrderType = option.type;
      let title = option.type == 'BUY' ? option.user == 'member' ? '承兑商收购记录' : 'C2C购买记录' : option.user == 'member' ? '承兑商出售记录' : 'C2C出售记录'
      uni.setNavigationBarTitle({
        title: title
      });
    } else {
      uni.switchTab({
        url: '../../index/index'
      });
    }
  },
  onShow() {
    if (this.$api.isLogin()) {
      this.pageNo = 1;
      this.list = [];
      this.noData = false;
      this.orderQuery();
      return false;
    }
    this.$api.goLogin('../../login/login');
  },
  methods: {
    //卖家强制打币
    forceTransforCoin(obj) {
      if (!this.payPwd) {
        this.errors('请输入资金密码');
        return false;
      }
      let param = {
        transOrderId: obj.transOrderId
      };
      let header = {
        "pay-password": this.payPwd
      };
      let name = this.userType == 'member' ? 'forceTransforCoinMember' : 'forceTransforCoinOrdinary';
      service[name](param, header).then(({
        data
      }) => {
        if (data.code == '100200') {
          this.closeModal('isForce');
          this.setType('COMPLETED');
          this.HMmessages.show('强制打币成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      })
    },
    //确定打币
    confirmTransfer(obj) {
      if (!this.payPwd) {
        this.errors('请输入资金密码');
        return false;
      }
      let name = this.userType == 'member' ? 'buyOrderEnsure' : 'sellOrderEnsure';
      let param = {
        transOrderId: obj.transOrderId
      };
      let header = {
        "pay-password": this.payPwd
      };
      let that = this;
      this.$api.showLoading();
      service[name](param, header).then(({
        data
      }) => {
        this.$api.hideLoading();
        if (data.code == '100200') {
          that.closeModal('isCoin');
          that.setType('COMPLETED');
          this.HMmessages.show('打币成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      })
    },
    //确认支付
    sure(obj) {
      if (!this.payPwd) {
        this.errors('请输入资金密码');
        return false;
      }
      let name = this.userType == 'member' ? 'sellOrderPay' : 'buyOrderPay';
      this.$api.showLoading();
      service[name]({
        transOrderId: obj.transOrderId
      }, {
        "pay-password": this.payPwd
      }).then(({
        data
      }) => {
        let that = this;
        this.$api.hideLoading();
        if (data.code == '100200') {

          that.closeModal('isSure');
          that.setType('PAID');
          this.HMmessages.show('支付成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      })
    },
    //取消订单
    cancel(obj) {
      let that = this;
      this.$api.showLoading();
      service.buyOrderCancel({
        transOrderId: obj.transOrderId
      }).then(({
        data
      }) => {
        this.$api.hideLoading();
        if (data.code == '100200') {

          that.closeModal('isOrederClose');
          that.setType('COMPLETED');
          this.HMmessages.show('取消订单成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      })
    },
    //获取订单列表
    orderQuery() {
      this.loading = true;
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orderType: this.c2cTransOrderType,
        status: this.type,
        c2cTransOrderType: this.region
      }
      service.orderQuery(param).then(({
        data
      }) => {
        this.loading = false;
        if (data.code == '100200') {
          let listArr = data.data.list;
          listArr.forEach((item, index) => {
            item.Time = '00:00'
            // 買單倒計時
            if (this.type === "UNPAY") {
              item.leftDate =
                1800000 -
                (parseInt(item.currentDate) - parseInt(item.createDate));
              if (item.leftDate <= 0) {
                item.leftDate = 0;
                return;
              }
              item.Time = moment(item.leftDate).format('mm:ss')
            }
          })
          this.list = this.list.concat(listArr);
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
      })
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
      this.orderQuery();
    },
    //文字提示
    Text(val) {
      switch (val) {
        case 'FINISHED':
          return '交易完成';
        case 'CANCELED':
          return '交易取消';
        case 'CLOSED':
          return '交易关闭';
        case 'OVERTIME':
          return '交易超时';
        case 'PAID':
          if (this.c2cTransOrderType == 'BUY') {
            return '交易成功，等待卖家打币';
          }
          return '';
        case 'COMPLAINNING':
          return '申诉中';
        default:
          return ''
      }
    },
    //设置查询类型
    setType(type) {
      this.type = type;
      this.loading = true;
      this.list = [];
      this.pageNo = 1;
      this.noData = false;
      this.orderQuery();
    },
    //未付款订单超时
    orderTime() {
      uni.showModal({
        content: '订单已超时',
        showCancel: false
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
    //设置item
    setItem(item, type) {
      this.itemObj = item;
      this[type] = !this[type];
    },
    //隐藏弹窗
    closeModal(name) {
      this[name] = false;
      this.payPwd = '';
    },
    //复制
    copy(text) {
      let that = this;
      uni.setClipboardData({
        data: text,
        success: () => {
          that.HMmessages.show('复制成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        }
      });
    },
    //联系对方
    contactPhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone
      });
    },
  }
}
