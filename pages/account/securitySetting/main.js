import {
  REG_EMAIL,
  REG_PHONE
} from '@/common/reg.js';
import comSvc from '@/common/comSvc.js';
import address from '../../../static/js/tel.js';
import service from '../service.js';
export default {
  data() {
    return {
      addressList: address,
      REG_EMAIL,
      showResetPwd: false,
      showResetPayPwd: false,
      isResetPayPwd: false,
      isPayPwd: false,
      isSetPhone: false,
      numTime: false,
      isSetGoogle: false,
      closeGoogle: false,
      isPCReset: false,
      isSetAlipay: false,
      isSetBank: false,
      num: 60,
      timeInt: null,
      numText: '60秒',
      resetPwd: {
        oldPwd: '',
        newPwd: '',
        cenPwd: '',
        google: ''
      },
      resetPayPwd: {
        newPwd: '',
        cenPwd: '',
        code: '',
        oldPwd: '',
        google: '',
        idNumber: ''
      },
      payPwd: '',
      phone: '',
      phoneCode: '',
      values: 0,
      secretKey: '',
      loginPassword: '',
      googleCode: '',
      bindAccount: '',
      ALIPAY: {
        alipayNo: '',
        name: '',
        noPay: true,
      },
      BANK: {
        acnumber: '',
        bank: '',
        name: '',
        subBank: '',
        noPay: true,
      },
      c2cInfo: {},
      disabled:true,
      result:'',
    };
  },
  //页面离开，删除定时器
  onUnload() {
    this.timeInt && clearInterval(this.timeInt);
  },
  onShow() {
   
    if (this.$api.isLogin()) {
      this.getC2cPayInfo();
      return false;
    }
    this.$api.goLogin('../../login/login')
  },
  methods: {
    
    //修改点击弹窗
    changePayType(name) {
      if (name == 'ALIPAY') {
        this.ALIPAY.alipayNo = this.c2cInfo.ALIPAY.alipayNo || '';
        this.ALIPAY.name = this.c2cInfo.ALIPAY.name || '';
        this.isSetAlipay = true;
      } else {
        this.BANK.acnumber = this.c2cInfo.BANK.acnumber || '';
        this.BANK.bank = this.c2cInfo.BANK.bank || '';
        this.BANK.name = this.c2cInfo.BANK.name || '';
        this.BANK.subBank = this.c2cInfo.BANK.subBank || '';
        this.isSetBank = true;
      }
    },
    //修改支付宝或者银行卡
    setPayType(type) {
      let name = '';
      let params = {};
      if (type == 'ALIPAY') {
        if (!this.ALIPAY.name) {
          this.errors('请输入支付宝昵称');
          return false;
        }
        if (!this.ALIPAY.alipayNo) {
          this.errors('请输入收付款账户');
          return false;
        }
        if (!this.payPwd) {
          this.errors('请输入资金密码');
          return false;
        }
        name = 'setAlipay';
        params = this.ALIPAY;
      } else {
        if (!this.BANK.bank) {
          this.errors('请输入银行名称');
          return false;
        }
        if (!this.BANK.subBank) {
          this.errors('请输入所在支行');
          return false;
        }
        if (!this.BANK.name) {
          this.errors('请输入开户姓名');
          return false;
        }
        if (!this.BANK.acnumber) {
          this.errors('请输入银行卡号');
          return false;
        }
        if (!this.payPwd) {
          this.errors('请输入资金密码');
          return false;
        }
        name = 'setBank'
        params = this.BANK;
      }
      this.$api.showLoading()
      service[name](params, {
        'pay-password': this.payPwd
      }).then(({
        data
      }) => {
        this.$api.hideLoading()
        if (data.code == '100200') {
          let that = this;

          that.closeModal(type == 'ALIPAY' ? 'isSetAlipay' : 'isSetBank');
          that.getC2cPayInfo();
          this.HMmessages.show('修改成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      })
    },
    //获取C2C支付绑定
    getC2cPayInfo() {
      service.getC2cPayInfo().then(({
        data
      }) => {
        if (data.code == '100200') {
          for (let i of data.data) {
            this.c2cInfo[i.c2cPayType] = i;
          }
          this.ALIPAY.noPay = this.c2cInfo.ALIPAY.alipayNo ? true : false;
          this.BANK.noPay = this.c2cInfo.BANK.acnumber ? true : false;
        } else {
          this.errors(data.msg);
        }
      })
    },
    //设置谷歌验证码
    setGoogleCode(e) {
      if (e.target.value) {
        if (this.GOOGLE.isBound == false) {
          this.bindAccount = `www.lkex.co(${this.USERINFO.account})`;
          this.isSetGoogle = true;
          service.getGoogelCode().then(({
            data
          }) => {
            if (data.code == '100200') {
              this.secretKey = data.data.secretcode;
            } else {
              this.errors(data.msg);
            }
          });
        } else {
          this.setGoogle(true)
        }
      } else {
        if (this.GOOGLE.isBound == true) {
          this.closeGoogle = true;
        }
      }
    },
    //设置谷歌验证码开启还是关闭
    setGoogle(bool) {
      let name = 'setGoogleOn'
      if (!bool) {
        if (!this.phoneCode) {
          this.errors('请输入验证码');
          return false;
        }
        if (!this.googleCode) {
          this.errors('请输入谷歌验证码');
          return false;
        }
        name = 'setGoogleOff'
      }
      this.$api.showLoading()
      service[name]({}, {
        'service-code': this.phoneCode,
        'google-code': this.googleCode
      }).then(({
        data
      }) => {
        this.$api.showLoading()
        let that = this;
        if (data.code == '100200') {

          that.closeModal('closeGoogle');
          that.$store.dispatch('getGoogle');
          this.HMmessages.show('更新成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg)
        }
      })
    },
    //第一次绑定谷歌验证码
    bindGoogle() {
      if (!this.loginPassword) {
        this.errors('请输入登录密码');
        return false;
      }
      if (!this.googleCode) {
        this.errors('请输入谷歌验证码');
        return false;
      }
      this.$api.showLoading()
      service
      .bingGoogle({}, {
        'login-password': this.loginPassword,
        'google-code': this.googleCode
      })
      .then(({
        data
      }) => {
        this.$api.hideLoading()
        let that = this;
        if (data.code == '100200') {
          that.closeModal('isSetGoogle');
          that.phone = '';
          that.phoneCode = '';
          that.$store.dispatch('getGoogle');
          this.HMmessages.show('绑定成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      });
    },
    //设置手机号
    setPhone() {
      if (!this.phone) {
        this.errors('请输入手机号');
        return false;
      }
      if (!Number(this.phone)) {
        this.errors('请输入正确的手机号');
        return false;
      }
      if (this.values == 0 && !REG_PHONE.test(this.phone)) {
        this.errors('请输入正确的手机号');
        return false;
      }
      if (!this.phoneCode) {
        this.errors('请输入验证码');
        return false;
      }
      this.$api.showLoading()
      service
      .setPhone({
        phone: this.addressList[this.values].tel + this.phone
      }, {
        'service-code': this.phoneCode
      })
      .then(({
        data
      }) => {
        this.$api.hideLoading()
        let that = this;
        if (data.code == '100200') {
          that.closeModal('isSetPhone');
          that.phone = '';
          that.phoneCode = '';
          that.$store.dispatch('getBasic');
          this.HMmessages.show('绑定成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      });
    },
    //设置区号
    bindPickerChange(e) {
      this.values = e.target.value;
    },
    //设置免密交易
    setAvoid(e) {
      let that = this;
      if (e.target.value) {
        that.$store.commit('setUserState', {
          states: 1
        });
        uni.showModal({
          title: '开启免密支付',
          content: '开启免密支付之后每次在交易中心进行买入/卖无需输入密码',
          success(res) {
            if (res.confirm) {
              that.$store.commit('setUserState', {
                states: 1
              });
              that.isPayPwd = true;
            } else if (res.cancel) {
              that.$store.commit('setUserState', {
                states: 0
              });
            }
          }
        });
      } else {
        that.$store.commit('setUserState', {
          states: 0
        });
        uni.showModal({
          title: '关闭免密支付',
          content: '关闭免密支付之后每次在交易中心进行买入/卖出需要输入密码',
          success(res) {
            if (res.confirm) {
              that.exemptionPayPwd();
            } else if (res.cancel) {
              that.$store.commit('setUserState', {
                states: 1
              });
            }
          }
        });
      }
    },
    //开启/关闭免密支付
    exemptionPayPwd(bool) {
      if (bool && !this.payPwd) {
        this.errors('请输入资金密码');
        return false;
      }
      this.$api.showLoading()
      service
      .exemptionPayPwd({
        states: this.AVOID
      }, {
        'pay-password': this.payPwd ? this.payPwd : '1'
      })
      .then(({
        data
      }) => {
        this.$api.hideLoading()
        let that = this;
        if (data.code == '100200') {
          that.closeModal('isPayPwd');
          that.payPwd = '';
          that.$store.dispatch('getUserState');
          this.HMmessages.show('更新成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      });
    },
    //重置资金密码
    ResetPayPwd() {
      if (!this.resetPayPwd.idNumber) {
        this.errors('请输入证件号码');
        return false;
      }
      if (!this.resetPayPwd.newPwd) {
        this.errors('请输入新密码');
        return false;
      }
      if (this.resetPayPwd.newPwd.length < 6 || this.resetPayPwd.newPwd.length > 20) {
        this.errors('密码长度为6-20个字符');
        return false;
      }
      if (!this.resetPayPwd.cenPwd || this.resetPayPwd.cenPwd != this.resetPayPwd.newPwd) {
        this.errors('密码输入不一致，请重新输入');
        return false;
      }
      if (!this.resetPayPwd.code) {
        this.errors('请输入验证码');
        return false;
      }
      if (this.GOOGLE.status == 'ON' && !this.resetPayPwd.google) {
        this.errors('请输入谷歌验证码');
        return false;
      }
      let params = {
        payPassword: this.resetPayPwd.cenPwd
      };
      let header = {
        'service-code': this.resetPayPwd.code,
        'passport-no': this.resetPayPwd.idNumber
      };
      if (this.GOOGLE.status == 'ON') {
        header['google-code'] = this.resetPayPwd.google;
      }
      this.$api.showLoading()
      service.changePayPwd(params, header).then(({
        data
      }) => {
        this.$api.hideLoading()
        let that = this;
        if (data.code == '100200') {
          that.closeModal('isResetPayPwd');
          that.resetPayPwd = {
            newPwd: '',
            cenPwd: '',
            code: '',
            oldPwd: '',
            google: '',
            idNumber: ''
          };
          this.HMmessages.show('重置成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.code == '104111' ? '证件号码错误' : data.msg);
        }
      });
    },
    //修改或者设置资金密码
    resetPayPwdSubmit() {
      if (this.USERINFO.setPayPassword && !this.resetPayPwd.oldPwd) {
        this.errors('请输入原密码');
        return false;
      }
      if (!this.resetPayPwd.newPwd) {
        this.errors('请输入新密码');
        return false;
      }
      if (this.resetPayPwd.newPwd.length < 6 || this.resetPayPwd.newPwd.length > 20) {
        this.errors('密码长度为6-20个字符');
        return false;
      }
      if (!this.resetPayPwd.cenPwd || this.resetPayPwd.cenPwd != this.resetPayPwd.newPwd) {
        this.errors('密码输入不一致，请重新输入');
        return false;
      }
      if (!this.resetPayPwd.code) {
        this.errors('请输入验证码');
        return false;
      }
      if (this.USERINFO.setPayPassword && this.GOOGLE.status == 'ON' && !this.resetPayPwd.google) {
        this.errors('请输入谷歌验证码');
        return false;
      }
      let params = {
        payPassword: this.resetPayPwd.cenPwd
      };
      let header = {
        'service-code': this.resetPayPwd.code
      };
      let name = '';
      if (this.USERINFO.setPayPassword) {
        name = 'changePayPwd';
        header['pay-password'] = this.resetPayPwd.oldPwd;
        if (this.GOOGLE.status == 'ON') {
          header['google-code'] = this.resetPayPwd.google;
        }
      } else {
        name = 'resetPayPwd';
      }
      this.$api.showLoading()
      service[name](params, header).then(({
        data
      }) => {
        this.$api.hideLoading()
        let that = this;
        if (data.code == '100200') {
          that.$store.dispatch('getBasic');
          that.closeModal('showResetPayPwd');
          that.resetPayPwd = {
            newPwd: '',
            cenPwd: '',
            code: '',
            oldPwd: '',
            google: '',
            idNumber: ''
          };
          this.HMmessages.show('修改成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      });
    },
    //修改登录密码
    resetPwdSubmit() {
      if (!this.resetPwd.oldPwd) {
        this.errors('请输入原密码');
        return false;
      }
      if (!this.resetPwd.newPwd) {
        this.errors('请输入新密码');
        return false;
      }
      if (this.resetPwd.newPwd.length < 6 || this.resetPwd.newPwd.length > 20) {
        this.errors('密码长度为6-20个字符');
        return false;
      }
      if (!this.resetPwd.cenPwd || this.resetPwd.cenPwd != this.resetPwd.newPwd) {
        this.errors('密码输入不一致，请重新输入');
        return false;
      }
      let header = {
        'login-password': this.resetPwd.oldPwd
      };
      if (this.GOOGLE.status == 'ON' && !this.resetPwd.google) {
        this.errors('请输入谷歌验证码');
        return false;
      } else {
        header['google-code'] = this.resetPwd.google;
      }
      this.$api.showLoading()
      service
      .resetPwd({
          loginPassword: this.resetPwd.cenPwd
        },
        header
      )
      .then(({
        data
      }) => {
        this.$api.hideLoading()
        if (data.code == '100200') {
          this.HMmessages.show('修改密码成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff',
            callback: () => {
              uni.removeStorageSync('LOGIN_TIME');
              uni.removeStorageSync('TOKEN');
              uni.reLaunch({
                url: '../../login/login'
              });
            }
          });
        } else {
          if (data.code == '105100') {
            this.HMmessages.show('密码错误已达10次账户被锁定，请找回登录密码', {
              textAlign: 'center',
              background: '#74272d',
              fontColor: '#fff',
              callback: () => {
                uni.reLaunch({
                  url: '../../login/login'
                });
              }
            });
          } else if (data.code == '104103') {
            this.errors('原密码错误');
          } else {
            this.errors(data.msg);
          }
        }
      });
    },
    //隐藏弹窗
    closeModal(name, payPwd) {
      this[name] = false;
      this.resetPwd = {
        oldPwd: '',
        newPwd: '',
        cenPwd: '',
        google: ''
      };
      this.resetPayPwd = {
        newPwd: '',
        cenPwd: '',
        code: '',
        oldPwd: '',
        google: '',
        idNumber: ''
      };
      this.payPwd = '';
      this.phone = '';
      this.phoneCode = '';
      this.loginPassword = '';
      this.googleCode = '';
      this.bindAccount = '';
      this.ALIPAY.alipayNo = ''
      this.ALIPAY.name = ''
      this.BANK.acnumber = ''
      this.BANK.bank = ''
      this.BANK.name = ''
      this.BANK.subBank = ''

      if (payPwd) {
        this.$store.commit('setUserState', {
          states: 0
        });
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
    //获取验证码倒计时
    times() {
      let that = this;
      clearInterval(this.timeInt);
      this.timeInt = setInterval(() => {
        that.num--;
        if (that.num == 0) {
          clearInterval(that.time);
          that.numTime = false;
          that.num = 60;
          that.numText = that.num + '秒';
        } else {
          that.numText = that.num + '秒';
          that.times();
        }
      }, 1000);
    },
    //获取验证码
    getCode() {
      let type = '';
      if (REG_EMAIL.test(this.USERINFO.account)) {
        type = 'EMAIL';
      } else {
        type = 'PHONE';
      }
      this.$api.showLoading()
      comSvc
      .getCode({
        sendType: type,
        sendAccount: this.USERINFO.account
      })
      .then(({
        data
      }) => {
        this.$api.hideLoading()
        if (data.code == '100200') {
          this.numTime = true;
          this.times();
          this.HMmessages.show('验证码已发送', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        } else {
          this.errors(data.msg);
        }
      });
    },
    //复制
    copy(value) {
      let that = this;
      uni.setClipboardData({
        data: value,
        success: () => {
          that.HMmessages.show('复制成功', {
            textAlign: 'center',
            background: '#356e36',
            fontColor: '#fff'
          });
        }
      });
    }
  }
};
