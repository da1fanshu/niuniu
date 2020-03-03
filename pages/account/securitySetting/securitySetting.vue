<template>
  <view class="content accountSet">
	  <!-- <view class="top_border">
	  	
	  </view> -->
    <view class="accountSet_main_list">
      <view class="accountSet_main_list_item clear">
        <view class="fl">
          <image src="/static/s1.png" mode="aspectFit"></image>
          <text>登录密码</text>
        </view>
        <view class="fr"><button class="btn_active" @click="showResetPwd = true">修改</button></view>
      </view>
      <view class="accountSet_main_list_item clear">
        <view class="fl">
          <image src="/static/s2.png" mode="aspectFit"></image>
          <text>资金密码</text>
        </view>
        <view class="fr">
          <button class="btn_default" v-if="USERINFO.setPayPassword" @click="isResetPayPwd = true" style="color: #000;">重置</button>
          <button class="btn_active" v-if="USERINFO.setPayPassword" @click="showResetPayPwd = true">修改</button>
          <button class="btn_active" v-if="USERINFO.setPayPassword == false" @click="showResetPayPwd = true">设置</button>
        </view>
      </view>
      <view class="accountSet_main_list_item clear">
        <view class="fl">
          <image src="/static/s3.png" mode="aspectFit"></image>
          <text>免密交易</text>
        </view>
        <view class="fr"><switch @change="setAvoid" :checked="AVOID == 1 ? true : false" style="transform:scale(0.7);" color="#03bcc0" /></view>
      </view>
      <view class="accountSet_main_list_item clear" v-if="REG_EMAIL.test(USERINFO.account)">
        <view class="fl">
          <image src="/static/set_phone.png" mode="aspectFit"></image>
          <text>手机号</text>
        </view>
        <view class="fr">
          <text class="btn_default" v-if="USERINFO.mobile">{{ USERINFO.mobile }}</text>
          <button v-else class="btn_active" @click="isSetPhone = true">设置</button>
        </view>
      </view>
    </view>

    <view class="accountSet_main_list">
      <view class="accountSet_main_list_item clear">
        <view class="fl">
          <image src="/static/s4.png" mode="aspectFit"></image>
          <text>支付宝</text>
        </view>
        <view class="fr">
          <button v-if="ALIPAY.noPay" class="btn_default" @click="changePayType('ALIPAY')">修改</button>
          <button v-else class="btn_active" @click="isSetAlipay = true">设置</button>
        </view>
      </view>
      <view class="accountSet_main_list_item clear">
        <view class="fl">
          <image src="/static/s5.png" mode="aspectFit"></image>
          <text>银行卡</text>
        </view>
        <view class="fr">
          <button v-if="BANK.noPay" class="btn_default" @click="changePayType('BANK')">修改</button>
          <button v-else class="btn_active" @click="isSetBank = true">设置</button>
        </view>
      </view>
    </view>

    <view class="accountSet_main_list">
      <view class="accountSet_main_list_item clear">
        <view class="fl">
          <image src="/static/s6.png" mode="aspectFit"></image>
          <text>谷歌验证</text>
        </view>
        <view class="fr">
          <button class="btn_default" v-if="GOOGLE.isBound && GOOGLE.status == 'ON'" @click="isPCReset = true"  style="color: #000;">重置</button>
          <switch @change="setGoogleCode" :checked="GOOGLE.status == 'ON' ? true : false" style="transform:scale(0.7);" color="#03bcc0" />
        </view>
      </view>
    </view>
    
    <!-- #ifdef APP-PLUS -->
    <!-- <view class="accountSet_main_list">
      <view class="accountSet_main_list_item clear">
        <view class="fl">
          <image src="/static/fingerprint.png" mode="aspectFit"""></image>
          <text>指纹登录</text>
        </view>
        <view class="fr">
          <button class="btn_active" @click="openFingerprint(true)">开启</button>
        </view>
      </view>
    </view> -->
    <!-- #endif -->
    
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>

    <!-- 修改密码 -->
    <Modal :title="'修改登录密码'" :isMask="true" v-if="showResetPwd" @close="closeModal('showResetPwd')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">原密码:</text>
            <view class="fr"><input type="password" v-model="resetPwd.oldPwd" placeholder="请输入原密码" /></view>
          </view>
          <view class="item clear">
            <text class="fl">新密码:</text>
            <view class="fr"><input type="password" v-model="resetPwd.newPwd" placeholder="请输入新密码(6-20个字符)" /></view>
          </view>
          <view class="item clear">
            <text class="fl">确认密码:</text>
            <view class="fr"><input type="password" v-model="resetPwd.cenPwd" placeholder="请确认密码" /></view>
          </view>
          <view class="item clear" v-if="GOOGLE.status == 'ON'">
            <text class="fl">谷歌验证码:</text>
            <view class="fr"><input type="number" v-model="resetPwd.google" placeholder="请输入谷歌验证码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('showResetPwd')">取消</view>
          <view class="active" @click="resetPwdSubmit()">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 设置/修改资金密码 -->
    <Modal :title="USERINFO.setPayPassword ? '修改资金密码' : '设置资金密码'" v-if="showResetPayPwd" @close="closeModal('showResetPayPwd')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear" v-if="USERINFO.setPayPassword">
            <text class="fl">原密码:</text>
            <view class="fr"><input type="password" v-model="resetPayPwd.oldPwd" placeholder="请输入原密码" /></view>
          </view>
          <view class="item clear">
            <text class="fl">新密码:</text>
            <view class="fr"><input type="password" v-model="resetPayPwd.newPwd" placeholder="请输入新密码(6-20个字符)" /></view>
          </view>
          <view class="item clear">
            <text class="fl">确认密码:</text>
            <view class="fr"><input type="password" v-model="resetPayPwd.cenPwd" placeholder="请确认密码" /></view>
          </view>
          <view class="item imgCode clear">
            <view class="fl">验证码:</view>
            <view class="fr">
              <view v-if="numTime == false"  style="width: auto;" class="code" @click="getCode()"><button plain>发送验证码</button></view>
              <view v-else class="code">
                <button plain disabled>{{ numText }}</button>
              </view>
              <input type="number" v-model="resetPayPwd.code" maxlength="6" placeholder="请输入验证码" />
            </view>
          </view>
          <view class="item clear" v-if="GOOGLE.status == 'ON'">
            <text class="fl">谷歌验证码:</text>
            <view class="fr"><input type="number" v-model="resetPayPwd.google" maxlength="6" placeholder="请输入谷歌验证码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('showResetPayPwd')">取消</view>
          <view class="active" @click="resetPayPwdSubmit()">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 重置资金密码 -->
    <Modal :title="'重置资金密码'" v-if="isResetPayPwd" @close="closeModal('isResetPayPwd')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear" v-if="USERINFO.setPayPassword">
            <text class="fl">证件号码:</text>
            <view class="fr"><input type="text" v-model="resetPayPwd.idNumber" placeholder="请输入证件号码" /></view>
          </view>
          <view class="item clear">
            <text class="fl">新密码:</text>
            <view class="fr"><input type="password" v-model="resetPayPwd.newPwd" placeholder="请输入新密码(6-20个字符)" /></view>
          </view>
          <view class="item clear">
            <text class="fl">确认密码:</text>
            <view class="fr"><input type="password" v-model="resetPayPwd.cenPwd" placeholder="请确认密码" /></view>
          </view>
          <view class="item imgCode clear">
            <view class="fl">验证码:</view>
            <view class="fr">
              <view v-if="numTime == false" class="code" @click="getCode()"><button plain>发送验证码</button></view>
              <view v-else class="code">
                <button plain disabled>{{ numText }}</button>
              </view>
              <input type="number" v-model="resetPayPwd.code" maxlength="6" placeholder="请输入验证码" />
            </view>
          </view>
          <view class="item clear" v-if="GOOGLE.status == 'ON'">
            <text class="fl">谷歌验证码:</text>
            <view class="fr"><input type="number" v-model="resetPayPwd.google" maxlength="6" placeholder="请输入谷歌验证码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('isResetPayPwd')">取消</view>
          <view class="active" @click="ResetPayPwd()">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 输入资金密码 -->
    <Modal :title="'是否开启资金免密支付'" v-if="isPayPwd" @close="closeModal('isPayPwd')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">资金密码:</text>
            <view class="fr"><input type="password" v-model="payPwd" placeholder="请输入资金密码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('isPayPwd', true)">取消</view>
          <view class="active" @click="exemptionPayPwd(true)">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 设置手机号 -->
    <Modal :title="'绑定手机号'" v-if="isSetPhone" @close="closeModal('isSetPhone')">
      <view class="common_model">
        <view class="common_form">
          <view class="item clear">
            <text class="fl">区号:</text>
            <view class="fr">
              <picker @change="bindPickerChange" :value="values" :range="addressList" :range-key="'cn'">
                <view class="uni-input">{{ addressList[values].cn }}({{ addressList[values].tel }})</view>
              </picker>
              <view class="downs"><uni-icons type="arrowdown" size="20" :color="'#fff'"></uni-icons></view>
            </view>
          </view>
          <view class="item clear">
            <text class="fl">手机号:</text>
            <view class="fr"><input type="number" v-model="phone" placeholder="请输入手机号" /></view>
          </view>
          <view class="item imgCode clear">
            <view class="fl">验证码:</view>
            <view class="fr">
              <view v-if="numTime == false" class="code" @click="getCode()"><button plain>发送验证码</button></view>
              <view v-else class="code">
                <button plain disabled>{{ numText }}</button>
              </view>
              <input type="number" v-model="phoneCode" maxlength="6" placeholder="请输入验证码" />
            </view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('isSetPhone')">取消</view>
          <view class="active" @click="setPhone()">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 第一次绑定谷歌验证码 -->
    <Modal :title="'绑定谷歌身份验证器'" v-if="isSetGoogle" @close="closeModal('isSetGoogle')">
      <view class="common_model">
        <view class="common_form">
          <view class="item imgCode clear">
            <view class="fl">绑定账户:</view>
            <view class="fr">
              <view class="code" @click="copy(bindAccount)"><button plain>复制</button></view>
              <input type="text" v-model="bindAccount" disabled />
            </view>
          </view>
          <view class="item imgCode clear">
            <view class="fl">密钥:</view>
            <view class="fr">
              <view class="code" @click="copy(secretKey)"><button plain>复制</button></view>
              <input type="text" v-model="secretKey" disabled />
            </view>
          </view>
          <view class="item clear">
            <text class="fl">登录密码:</text>
            <view class="fr"><input type="password" v-model="loginPassword" placeholder="请输入登录密码" /></view>
          </view>
          <view class="item clear">
            <text class="fl">谷歌认证:</text>
            <view class="fr"><input type="number" v-model="googleCode" maxlength="6" placeholder="请输入谷歌验证码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('isSetGoogle')">取消</view>
          <view class="active" @click="bindGoogle()">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 关闭谷歌验证码 -->
    <Modal :title="'关闭谷歌验证'" v-if="closeGoogle" @close="closeModal('closeGoogle')">
      <view class="common_model">
        <view class="common_form">
          <view class="item imgCode clear">
            <view class="fl">验证码:</view>
            <view class="fr">
              <view v-if="numTime == false" class="code" @click="getCode()"><button plain>发送验证码</button></view>
              <view v-else class="code">
                <button plain disabled>{{ numText }}</button>
              </view>
              <input type="number" v-model="phoneCode" maxlength="6" placeholder="请输入验证码" />
            </view>
          </view>
          <view class="item clear">
            <text class="fl">谷歌验证码:</text>
            <view class="fr"><input type="number" v-model="googleCode" maxlength="6" placeholder="请输入谷歌验证码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('closeGoogle')">取消</view>
          <view class="active" @click="setGoogle()">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 重置谷歌验证码需要到PC进行 -->
    <Modal :title="'重置谷歌验证'" v-if="isPCReset" @close="closeModal('isPCReset')">
      <view class="common_model">
        <view style="line-height: 80upx; margin-bottom: 20upx; font-size: 28upx; text-align: center;color: #000;">重置谷歌验证码请到电脑端进行重置操作</view>
        <view class="common_btn"><view class="active" @click="closeModal('isPCReset')">确定</view></view>
      </view>
    </Modal>

    <!-- 修改支付宝设置 -->
    <Modal :title="'修改支付宝设置'" v-if="isSetAlipay" @close="closeModal('isSetAlipay')">
      <view class="common_model">
        <view class="common_form">
          <view class="item imgCode clear">
            <view class="fl">支付宝昵称:</view>
            <view class="fr"><input type="text" v-model="ALIPAY.name" placeholder="请输入支付宝昵称" /></view>
          </view>
          <view class="item clear">
            <text class="fl">收付款账户:</text>
            <view class="fr"><input type="text" v-model="ALIPAY.alipayNo" placeholder="请输入收付款账户" /></view>
          </view>
          <view class="item clear">
            <text class="fl">资金密码:</text>
            <view class="fr"><input type="password" v-model="payPwd" placeholder="请输入资金密码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('isSetAlipay')">取消</view>
          <view class="active" @click="setPayType('ALIPAY')">确定</view>
        </view>
      </view>
    </Modal>

    <!-- 修改银行卡设置 -->
    <Modal :title="'修改银行卡设置'" v-if="isSetBank" @close="closeModal('isSetBank')">
      <view class="common_model">
        <view class="common_form">
          <view class="item imgCode clear">
            <view class="fl">银行名称:</view>
            <view class="fr"><input type="text" v-model="BANK.bank" placeholder="请输入银行名称" /></view>
          </view>
          <view class="item clear">
            <text class="fl">所在支行:</text>
            <view class="fr"><input type="text" v-model="BANK.subBank" placeholder="请输入所在支行" /></view>
          </view>
          <view class="item clear">
            <text class="fl">开户姓名:</text>
            <view class="fr"><input type="text" v-model="BANK.name" placeholder="请输入开户姓名" /></view>
          </view>
          <view class="item clear">
            <text class="fl">银行卡号:</text>
            <view class="fr"><input type="text" v-model="BANK.acnumber" placeholder="请输入银行卡号" /></view>
          </view>
          <view class="item clear">
            <text class="fl">资金密码:</text>
            <view class="fr"><input type="password" v-model="payPwd" placeholder="请输入资金密码" /></view>
          </view>
        </view>
        <view class="common_btn">
          <view @click="closeModal('isSetBank')">取消</view>
          <view class="active" @click="setPayType('BANK')">确定</view>
        </view>
      </view>
    </Modal>
  </view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import { uniIcon, uniPopup } from '@dcloudio/uni-ui';
import { mapGetters } from 'vuex';
import Modal from '@/components/lkex-modal/index.vue';
import main from './main.js';
export default {
  components: { uniIcon, uniPopup, HMmessages, Modal },
  mixins: [main],
  computed: {
    ...mapGetters(['GOOGLE', 'AVOID', 'USERINFO'])
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
