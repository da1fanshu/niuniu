<template>
  <view class="content">
    <scroll-view scroll-y style="height: 100%;" @scrolltolower="load">
      <view class="my_bonus">
        <view class="created_created" @click="showRed = true">
          <view class="puls"><uni-icons type="scan" :color="'#191e2a'"></uni-icons></view>
          <text style="margin-top: 12upx;">领取红包</text>
        </view>
        <view class="bonus_nav">
          <button :class="type == 'receive' ? 'active' : ''" @click="type = 'receive'">我收到的</button>
          <button :class="type == 'issue' ? 'active' : ''" @click="type = 'issue'">我发出的</button>
        </view>
        <view class="bonus_text">
          <text style="margin-top: 12upx;" v-if="type == 'receive'">累计收到</text>
          <text style="margin-top: 12upx;" v-else>累计发出</text>
          <text style="color: #d14b64; margin-left: 30rpx;">{{ total }} 个红包</text>
        </view>
        <view class="bonus_list">
          <view class="item" v-for="(item, index) in list" :key="index" @click="getAllrecord(type == 'receive' ? item.redPaperGain.paperId : item.id)">
            <template v-if="type == 'receive'">
              <view class="clear">
                <view class="fl">
                  来自{{
                    REG_EMAIL.test(type == 'receive' ? item.sourceAccount : '')
                      ? filter.email(type == 'receive' ? item.sourceAccount : '')
                      : filter.getSuffixPhone(type == 'receive' ? item.sourceAccount : '')
                  }}
                  的红包
                </view>
                <view class="fr" style="color: #d14b64;">
                  +{{ type == 'receive' ? item.redPaperGain.gainAsset : '' }} {{ type == 'receive' ? item.redPaperGain.assetCode : '' }}
                </view>
              </view>
              <view class="clear">
                <view class="fl">{{ $formta(type == 'receive' ? item.redPaperGain.createTime : '', 'yyyy-MM-dd hh:mm:ss') }}</view>
              </view>
            </template>
            <template v-else>
              <view class="clear">
                <view class="fl">{{ item.assetCode }} 红包 ({{ item.paperCode }})</view>
                <view class="fr" style="color: #d14b64;">{{ item.assetAmount }} {{ item.assetCode }}</view>
              </view>
              <view class="clear">
                <view class="fl">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm:ss') }}</view>
                <view class="fr">
                  <text>剩余个数（{{ item.paperNumRemain }}）</text>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
      <uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
    </scroll-view>
    <HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
    <!-- 添加地址 -->
    <Modal :title="'红包领取'" :isMask="true" v-if="showRed" @close="closeModal('showRed')">
      <view class="common_model">
        <view class="common_form">
          <!-- #ifdef H5 -->
          <view class="item clear">
            <text class="fl">红包码:</text>
            <view class="fr"><input type="text" v-model="redCode" placeholder="请输入红包码" /></view>
          </view>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <view class="item imgCode clear">
            <text class="fl">红包码:</text>
            <view class="fr">
              <view class="code"><button @click="scan">扫描</button></view>
              <input type="text" v-model="redCode" placeholder="请输入红包码" />
            </view>
          </view>
          <!-- #endif -->
          <view class="item clear">
            <text class="fl">领取账户:</text>
            <view class="fr"><input type="text" v-model="name" placeholder="请输入领取账户" /></view>
          </view>
        </view>
        <view class="common_btn">
          <button @click="closeModal('showRed')">取消</button>
          <button class="active" @click="getRed()">确定</button>
        </view>
      </view>
    </Modal>

    <uni-popup :show="showList" position="middle" :h5-top="true" mode="fixed" @hidePopup="hidePopup()">
      <view class="ren_mian">
        <view class="ren_info">
          <view class="user">{{ REG_EMAIL.test(launchUser.account) ? filter.email(launchUser.account) : filter.getSuffixPhone(launchUser.account) }} 的红包</view>
          <view class="surplus">
            领取 {{ launchUser.paperNum - launchUser.paperNumRemain }} / {{ launchUser.paperNum }} 个，剩余{{ filter.fix(launchUser.assetAmountRemain, 4) }}
          </view>
          <view class="share" v-if="launchUser.paperNumRemain != '0'"><button @click="shareFc()">分享红包</button></view>
        </view>
        <view class="list">
          <view class="item" v-for="(item, index) in receiveList" :key="index">
            <view class="clear">
              <view class="fl">领取用户：{{ REG_EMAIL.test(item.account) ? filter.email(item.account) : filter.getSuffixPhone(item.account) }}</view>
              <view class="fr" style="color: #d14b64;">+{{ item.gainAsset }}</view>
            </view>
            <view class="clear">
              <view class="fl">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm:ss') }}</view>
            </view>
          </view>
          <uni-load-more v-if="!receiveList[0]" status="noMore"></uni-load-more>
        </view>
      </view>
    </uni-popup>
    
    <!-- 海报 -->
    <view class="flex_row_c_c modalView" :class="qrShow ? 'show' : ''" @tap="hideQr()">
      <view class="flex_column">
        <view class="backgroundColor-white padding1vh border_radius_10px"><image :src="poster.finalPath" mode="widthFix" class="posterImage"></image></view>
        <view class="flex_row marginTop2vh">
          <!-- #ifdef H5 -->
          <template v-if="is_weixin">
            <a class="d_img" :href="poster.finalPath">请长按保存或者分享给好友</a>
          </template>
          <template v-else>
            <a class="d_img" :href="poster.finalPath" download="红包.jpg">保存图片</a>
          </template>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <button type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
          <button type="primary" size="mini" @tap.prevent.stop="share()">分享图片</button>
          <!-- #endif -->
        </view>
      </view>
    </view>
    <view class="hideCanvasView">
      <canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{ width: (poster.width || 0) + 'px', height: (poster.height || 0) + 'px' }"></canvas>
    </view>
  </view>
</template>

<script>
import { uniIcon, uniLoadMore, uniPopup } from '@dcloudio/uni-ui';
import uniIcons from "@/components/uni-icon/uni-icon.vue"
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from './service.js';
import Modal from '@/components/lkex-modal/index.vue';
import { REG_EMAIL } from '@/common/reg.js';
import filter from '@/common/filter.js';
import _app from '@/util/QS-SharePoster/app.js';
import getSharePoster from '@/util/QS-SharePoster/QS-SharePoster.js';
export default {
  components: {
    uniIcon,
	uniIcons,
    uniLoadMore,
    HMmessages,
    Modal,
    uniPopup
  },
  data() {
    return {
      REG_EMAIL,
      type: 'receive', //receive,issue
      list: [],
      pageNo: 1,
      pageSize: 10,
      loading: true,
      noData: false,
      total: 0,
      redCode: '',
      filter,
      name: '',
      showRed: false,
      showList: false,
      receiveList: [],
      invtCode: '',
      launchUser: '',
      poster: {},
      qrShow: false,
      canvasId: 'default_PosterCanvasId',
      is_weixin:false,
    };
  },
  onLoad() {
    this.name = uni.getStorageSync('account') ? uni.getStorageSync('account') : '';
    if (this.type == 'receive') {
      this.getReceive();
    } else {
      this.getDistribute();
    }
    // #ifdef H5
    let is_weixin = (function() {
      return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
    })();
    if (is_weixin) {
      this.is_weixin = true;
    }
    // #endif
  },
  onNavigationBarButtonTap() {
    this.$goPage('distribute/distribute');
  },
  watch: {
    type(val) {
      this.list = [];
      this.noData = false;
      this.pageNo = 1;
      this.total = 0;
      if (this.type == 'receive') {
        this.getReceive();
      } else {
        this.getDistribute();
      }
    }
  },
  methods: {
    
    // 海报图专用
    async shareFc() {
      try {
        if (true) {
          let that = this;
          const d = await getSharePoster({
            type: 'testShareType',
            // #ifdef APP-PLUS
            backgroundImage: 'https://whole.lkex.co/redWin.jpg',
            // #endif
            posterCanvasId: this.canvasId,
            qrCodeArray: ({ bgObj, type, bgScale }) => {
              return [
                {
                  text: `https://lkex.co/#/?redCode=${that.launchUser.id}&type=red`,//生产环境
                  size: bgObj.width * 0.3,
                  dx: bgObj.width * 0.05,
                  dy: bgObj.height - bgObj.width * 0.35,
                  image:'/static/codeIcon.png'
                }
              ];
            },
            textArray: ({ bgObj, type, bgScale }) => {
              const fontSize = bgObj.width * 0.055;
              const lineHeight = bgObj.height * 0.04;
              return [
                {
                  text: `红包码：${that.launchUser.paperCode}`,
                  size: fontSize,
                  color: 'white',
                  textAlign: 'left',
                  textBaseline: 'middle',
                  infoCallBack(textLength) {
                    // _app.log('index页面的text的infocallback ，textlength:' + textLength);
                    return {
                      dx: bgObj.width - textLength - fontSize,
                      dy: bgObj.height - lineHeight
                    };
                  }
                }
              ];
            },
            setCanvasWH: ({ bgObj, type, bgScale }) => {
              // 为动态设置画布宽高的方法，
              this.poster = bgObj;
            }
          });
          // console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath);
          this.poster.finalPath = d.poster.tempFilePath;
        }
        this.qrShow = true;
      } catch (e) {
        _app.hideLoading();
        _app.showToast(JSON.stringify(e));
        
      }
    },
    saveImage() {
      // #ifndef H5
      uni.saveImageToPhotosAlbum({
        filePath: this.poster.finalPath,
        success(res) {
          _app.showToast('保存成功');
        }
      });
      // #endif
      // #ifdef H5
      _app.showToast('保存成功');
      // #endif
    },
    share() {
      // #ifdef APP-PLUS
      _app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
      // #endif
    
      // #ifndef APP-PLUS
      _app.showToast('分享成功');
      // #endif
    },
    hideQr() {
      this.qrShow = false;
    },
    // 海报图专用-end
    
    
    
    //隐藏红包信息
    hidePopup() {
      this.showList = false;
    },
    //查询领取记录
    getAllrecord(id) {
      this.showList = true;
      this.$api.showLoading();
      service
        .getAllrecord({
          paperId: id
        })
        .then(({ data }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            this.invtCode = data.data.inviteCode;
            this.launchUser = data.data.redPaper;
            this.receiveList = data.data.redPaperGains;
          } else {
            this.errors(data.msg);
          }
        });
    },
    //领取红包
    getRed() {
      if (!this.redCode) {
        this.errors('请输入红包码');
        return false;
      }
      if (!this.name) {
        this.errors('请输入领取账户');
      }
      this.$api.showLoading();
      service
        .gain({
           account: REG_EMAIL.test(this.name) ? this.name : '86' + this.name,
          paperCode: this.redCode,
          type: REG_EMAIL.test(this.name) ? 'EMAIL' : 'MOBILE'
        })
        .then(({ data }) => {
          this.$api.hideLoading();
          if (data.code == '100200') {
            this.closeModal('showRed');
            this.HMmessages.show('红包领取成功', {
              textAlign: 'center',
              background: '#356e36',
              fontColor: '#fff'
            });
            this.list = [];
            this.noData = false;
            this.pageNo = 1;
            this.total = 0;
            if (this.type == 'receive') {
              this.getReceive();
            } else {
              this.getDistribute();
            }
          } else {
            this.errors(data.msg);
          }
        });
    },
    //扫描二维码
    scan() {
      let that = this;
      uni.scanCode({
        success: function(res) {
          // console.log('条码类型：' + res.scanType);
          if(res.result.indexOf('?redCode=') > -1){
            let code = res.result.split('redCode=');
            uni.navigateTo({
              url:'/pages/luckDraw/luckDraw?redCode=' + code[1]
            })
          }else{
            uni.showToast({
              title:'请确认二维码为本站红包码'
            })
          }
          // console.log('条码内容：' + res.result);
        }
      });
    },
    closeModal(name) {
      this[name] = false;
    },
    //获取我的发出记录
    getDistribute() {
      this.loading = true;
      service
        .getDistribute({
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(({ data }) => {
          this.loading = false;
          if (data.code == '100200') {
            this.total = data.data.total;
            this.list = this.list.concat(data.data.list);
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
    //获取我的领取记录
    getReceive() {
      this.loading = true;
      service
        .getReceive({
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
        .then(({ data }) => {
          this.loading = false;
          if (data.code == '100200') {
            this.total = data.data.total;
            this.list = this.list.concat(data.data.list);
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
      this.getReceive();
    },
    //错误提示
    errors(text) {
		uni.showToast({
		  title:text
		})
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
