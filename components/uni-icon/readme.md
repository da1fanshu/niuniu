### Icon 图标

用于展示 icon，组件名：``uni-icons``，代码块： uIcon。

**使用方式：**

在 ``script`` 中引用组件 

```javascript
import uniIcon from "@/components/uni-icon/uni-icon.vue"
export default {
    components: {uniIcon}
}
```

在 ``template`` 中使用组件

```html
<uni-icons type="contact" size="30"></uni-icons>
```

实际效果参考：[https://github.com/dcloudio/uni-ui](https://github.com/dcloudio/uni-ui)

**Icon 属性说明：**

|属性名		|类型|默认值	|说明|
|---|----|---|---|
|type	|String	|-|图标图案，参考下表|
|color	|String	|-|图标颜色	|
|size	|Number	|24|图标大小|
|@click	|EventHandle|-|点击 Icon 触发事件|

**type 类型：**

<div>
  <link rel="stylesheet" type="text/css" href="https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/icon1.1.css"/>
  <ul class="icon-group">
  	<li class="icon-item"><span class="uni-icons uni-icons-contact"></span><span>contact</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-person"></span><span>person</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-personadd"></span><span>personadd</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-contact-filled"></span><span>contact-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-person-filled"></span><span>person-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-personadd-filled"></span><span>personadd-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-phone"></span><span>phone</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-email"></span><span>email</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-chatbubble"></span><span>chatbubble</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-chatboxes"></span><span>chatboxes</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-phone-filled"></span><span>phone-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-email-filled"></span><span>email-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-chatbubble-filled"></span><span>chatbubble-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-chatboxes-filled"></span><span>chatboxes-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-weibo"></span><span>weibo</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-weixin"></span><span>weixin</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-pengyouquan"></span><span>pengyouquan</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-chat"></span><span>chat</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-qq"></span><span>qq</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-videocam"></span><span>videocam</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-camera"></span><span>camera</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-mic"></span><span>mic</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-location"></span><span>location</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-mic-filled"></span><span>mic-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-location-filled"></span><span>location-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-micoff"></span><span>micoff</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-image"></span><span>image</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-map"></span><span>map</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-compose"></span><span>compose</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-trash"></span><span>trash</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-upload"></span><span>upload</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-download"></span><span>download</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-close"></span><span>close</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-redo"></span><span>redo</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-undo"></span><span>undo</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-refresh"></span><span>refresh</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-star"></span><span>star</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-plus"></span><span>plus</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-minus"></span><span>minus</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-circle"></span><span>circle</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-clear"></span><span>clear</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-refresh-filled"></span><span>refresh-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-star-filled"></span><span>star-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-plus-filled"></span><span>plus-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-minus-filled"></span><span>minus-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-circle-filled"></span><span>circle-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-checkbox-filled"></span><span>checkbox-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-closeempty"></span><span>closeempty</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-refreshempty"></span><span>refreshempty</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-reload"></span><span>reload</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-starhalf"></span><span>starhalf</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-spinner"></span><span>spinner</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-spinner-cycle"></span><span>spinner-cycle</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-search"></span><span>search</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-plusempty"></span><span>plusempty</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-forward"></span><span>forward</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-back"></span><span>back</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-checkmarkempty"></span><span>checkmarkempty</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-home"></span><span>home</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-navigate"></span><span>navigate</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-gear"></span><span>gear</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-paperplane"></span><span>paperplane</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-info"></span><span>info</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-help"></span><span>help</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-locked"></span><span>locked</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-more"></span><span>more</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-flag"></span><span>flag</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-home-filled"></span><span>home-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-gear-filled"></span><span>gear-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-info-filled"></span><span>info-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-help-filled"></span><span>help-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-more-filled"></span><span>more-filled</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-settings"></span><span>settings</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-list"></span><span>list</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-bars"></span><span>bars</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-loop"></span><span>loop</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-paperclip"></span><span>paperclip</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-eye"></span><span>eye</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowup"></span><span>arrowup</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowdown"></span><span>arrowdown</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowleft"></span><span>arrowleft</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowright"></span><span>arrowright</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowthinup"></span><span>arrowthinup</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowthindown"></span><span>arrowthindown</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowthinleft"></span><span>arrowthinleft</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-arrowthinright"></span><span>arrowthinright</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-pulldown"></span><span>pulldown</span></li>
  	<li class="icon-item"><span class="uni-icons uni-icons-scan"></span><span>scan</span></li>
  </ul>
</div>
