import BigNumber from '../static/js/bignumber.3.0.1.min.js';
import bigdecimal from "../static/js/bigdecimal.js";
const PRECISION = 4;
//修正乘法的精度问题
let accMul = function(arg1, arg2) {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};

/**
 * 保留小数位
 * @param name
 * @param str
 * @param length
 * @returns {string}
 */
let fix = function(name, str, length) {
  str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
  length = isNaN(parseInt(length)) ? PRECISION : parseInt(length);
  let pow = Math.pow(10, length);
  //修正小数乘一个整数出小数的情况,乘完之后再进行四舍五入取0位小数
  return ((Math[name](accMul(str, pow))) / pow).toFixed(length);
};


function getNum(num) {
  let result;
  try {
    result = new bigdecimal.BigDecimal('' + num).toPlainString();
  } catch (e) {
    result = num;
  }
  return result;
}


/**
 * 向右移动小数点 ,相当于乘10的_pointcount次幂
 * @param _number 操作的数字
 * @param _pointcount 向右移动的位数
 * @returns 移动以后的数字(number类型)
 */
function moveRight(_number, _pointcount) {
  if (Number(_number) !== Number(_number)) {
    return _number;
  }
  let flag = 1;
  if (_number < 0) {
    flag = -1;
    _number = _number * -1;
  }
  let numStr = _number.toString();
  let strArr = numStr.split(".");
  let rightStr = strArr.length > 1 ? strArr[1] : "";
  //在不足移动的位数后补0;
  if (rightStr.length < _pointcount) {
    let addZero = [];
    for (let i = rightStr.length; i < _pointcount; i++) {
      addZero.push("0");
    }
    rightStr = rightStr + addZero.join("");
  }
  return Number(strArr[0] + rightStr.substring(0, _pointcount) + "." + rightStr.substr(_pointcount)) * flag;
}

/**
 * 向左移动小数点,相当于_number除以10的_pointcount次幂
 * @param _number 操作的数字
 * @param _pointcount 向左移动的位数
 * @returns 移动以后的数字(number类型)
 */
function moveLeft(_number, _pointcount) {
  //判断是否为数字,非数字直接返回本身
  if (Number(_number) !== Number(_number)) {
    return _number;
  }
  let flag = 1;
  if (_number < 0) {
    flag = -1;
    _number = _number * -1;
  }
  //number转换为string ,方便后续操作。
  let numStr = _number.toString();
  //按照小数点分隔字符串,
  let strArr = numStr.split(".");
  let num = 0,
    zeroArr = [];
  //生成移动位数+1的0 ,补到分隔后的第一个字符串中,兼容0.XXX的情况。开头多余的零会在调用Number方法时去掉。
  while (num < _pointcount + 1) {
    zeroArr.push("0");
    num++;
  }
  let leftStr = zeroArr.join("") + strArr[0];
  let leftArr = leftStr.split("");
  //插入移动后的小数点。
  leftArr.splice((leftStr.length - _pointcount), 0, '.');
  let result = leftArr.join("");
  //拼接原始值小数点后的数字
  if (strArr.length > 1) {
    result += strArr[1];
  }
  return Number(result) * flag;
}

function add(_num1, _num2, precision) {
  if (!precision) {
    precision = PRECISION;
  }
  _num1 = getNum(_num1);
  _num2 = getNum(_num2);
  return moveLeft(moveRight(_num1, precision) + moveRight(_num2, precision), precision)
}

export default {
  abs(str) { // 绝对值
    str = isNaN(parseFloat(str)) ? 0 : parseFloat(str);
    return Math.abs(str);
  },
  fix(str, length) { // 四舍五入后保留多少位小数
    return fix('round', str, length);
  },
  floorFix(str, length) { // 去尾后保留多少位小数
    return fix('floor', str, length);
    // return this.floorFixPrice(str, length);
  },
  floorFixPrice(str, length) {
    // 计算小数精度不准确的问题
    // 如0.230022200000001 => 0.2300002
    str = isNaN(parseFloat(str)) ? 0 : parseFloat(str).toFixed(length);
    length = isNaN(parseInt(length)) ? PRECISION : parseInt(length);
    return tool(str, length);

    function tool(number, precision) {
      let num = Math.pow(10, precision);
      let price = new BigNumber(number).mul(num).floor().div(num);
      price = new bigdecimal.BigDecimal('' + price).toPlainString();
      return formatZeroSuffix(price, precision);
    }

    /**
     * 补零
     * @param num
     * @param len
     * @returns {*}
     */
    function formatZeroSuffix(num, len) {
      let arrs = (num + '').split('.');

      let d = arrs[1];
      let l;

      // 没有小数点
      if (d === undefined) {
        if (len === 0) {
          return num;
        } else {
          return num + '.' + getZeros(len, 0);
        }
      } else if (d === '') { // 最后一位是小数点
        return num + getZeros(len, 0);
      } else {
        l = d.length;
        return num + getZeros(len, l);
      }

      function getZeros(len, l) {
        let zeros = '';
        for (let i = 0; i < len - l; i++) {
          zeros = zeros + '0';
        }
        return zeros;
      }
    }
  },
  ceilFix(str, length, isGop) { // 向上进一后保留多少位小数 最后一个参数默认就是两位，true为果仁数设置为三位
    if (str === 0 || (str + '').indexOf('.') < 0) {
      return (isGop === undefined ? (str + '.00') : (str + '.000'));
    }
    return ((str + '').split('.')[1].length && (str + '').split('.')[1].length === (length ? length : 2)) ? parseFloat(
      str) : fix('ceil', parseFloat(str), length);
  },
  tail(str, length) { // 尾数
    str = typeof str !== 'string' ? '' : parseFloat(str);
    length = isNaN(parseInt(length)) ? 4 : Math.abs(parseInt(length));
    return str.substr(-length);
  },
  omit(str, length, replace) { // 省略
    let l = 5; // 默认保留长度
    length = isNaN(parseInt(length)) ? l : parseInt(length); //没传length isNaN()返回true
    return str.length > length ? (str.substring(0, length) + (replace || '...')) : str;
  },
  phone(str) { // 手机省略
    let phoneReg =  /^((\+?86)|(\(\+86\)))?1\d{10}$/;
    return phoneReg.test(str) ? String(str).slice(0,2).substr(0, 3) + '****' + String(str).substr(-4) : str;
  },
  /**
   * 將電話加密顯示
   * @param phone
   * @returns {string}
   */
  getSuffixPhone(phone) {
    phone = phone + "";
    let phoneReg =  /^((\+?86)|(\(\+86\)))?1\d{10}$/;
    phone = phoneReg.test(phone) ? phone.slice(2) : phone;
    let passedStr = phone.substring(3, 7);
    return phone.replace(passedStr, "****");
  },
  email(str) {
    if (!str) {
      return '';
    }
    let idx = str.indexOf('@');
    let passedStr = str.substring(2, idx);
    return str.replace(passedStr, '****');
  },
  getFormattedUid(uid) {
    const BASE_UID_NO = 100000;
    return add(BASE_UID_NO, uid);
  },
  /**
   * 加密銀行卡
   * @param bankCode
   * @returns {string}
   */
  getSuffixBank(bankCode) {
    bankCode = bankCode + "";
    let len = bankCode.length;
    let passedStr = bankCode.substring(4, len - 4);
    return bankCode.replace(passedStr, "****");
  },
};
