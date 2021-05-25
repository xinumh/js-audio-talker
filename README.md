# js-audio-talk



## npm 或 yarn 安装



```she
yarn add js-audio-talk
```



## 引用

> 注意: 通过 MediaDevices.getUserMedia() 获取用户多媒体权限时，需要注意其只工作于以下三种环境：

- localhost 域

- 开启了 HTTPS 的域

- 使用 file:/// 协议打开的本地文件


```js
import { Talker } from 'js-audio-talk'

const talker = new Talker({socketUrl: 'ws://192.168.1.108:40001/talk'})

const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

startButton.onclick = () => {
	talker.start().then(successCb).catch(errorCb)
}

stopButton.onclick = () => {
	talker.stop().then(successCb).catch(errorCb)
}

```

## 参考文档

[https://recorder.zhuyuntao.cn/](https://recorder.zhuyuntao.cn/)

[https://github.com/rochars/alawmulaw](https://github.com/rochars/alawmulaw)