
export const REG_EN = /^[\a-zA-Z0-9]+$/;
export const REG_CH = /^[\u4e00-\u9fa5]+$/; // 中文


export const REG_INTEGER = /^[1-9]+[0-9]*$/;

export const REG_NUMBER = /^[1-9]+[0-9]*(\.\d{0,4})?$/;
export const REG_DECIMAL = /^0(\.\d{0,4})?$/;

export const REG_EMAIL = /@([a-zA-Z0-9]+[_|\_|\.\-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
export const REG_PHONE = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;
export const REG_EMAIL_PHONE = /(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)|(^1[3|4|5|6|7|8|9]\d{9}$)/;
export const REG_CH_PHONE = /^((\+?86)|(\(\+86\)))?1\d{10}$/;

export const REG_LOGPWD=/(?!^[0-9]{6,20}$)^[0-9A-Za-z\u0021-\u007e]{6,20}$/;
export const REG_PAYPWD=/(?!^[0-9]{8,20}$)^[0-9A-Za-z\u0021-\u007e]{8,20}$/;

export const REG_URL = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
export const REG_ADDR = /^[\w\-\@?^=%&\/~\+#]+[\w,`\-\.\@?^=%&\/~\+#\s]*$/;

export const REG_CH_NAME = /^[\u4e00-\u9fa5·-]+$/;
export const REG_EN_NAME = /^[a-zA-Z]*$/;
export const REG_ID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

export const MAX_FORM_NUMBER = 99999999.99;

export const REG_EN_UPP = /^[A-Z]*$/;

export const REG_LINK_KEY = /^[0-9a-zA-Z]{4}$/;//push交易私链密码格式