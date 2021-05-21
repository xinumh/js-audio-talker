# js-audio-talk



## npm 或 yarn 安装



```she
yarn add js-audio-talk
```



## 引用



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