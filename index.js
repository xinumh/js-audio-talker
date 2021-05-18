
function Talker ({socketUrl=''}) {
  var alawmulaw = require('./alawmulaw.js')
  var audioContext = null
  var socketUrl = socketUrl
  var inputSampleBits = 16       // 输入采样位数
  var oututSampleBits = 16       // 输出采样率

  var inputSampleRate = 48000    // 输入采样率
  var outputSampleRate = 8000    // 输出采样率

  var littleEdian = true         // 是否是小端字节序
  var source = null              // 音频输入
  var recorder = null          // 创建一个 ScriptProcessorNode

  var socket = null


  /**
   * navigator.mediaDevices
   * 
   */
  const initUserMedia = () => {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error('浏览器不支持 getUserMedia !'));
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }
  }

  /**
   * getPermission
   * 授权麦克风权限
   */
  const getPermission = () => {
    const constraints = { audio: true } // 指定了请求使用媒体的类型
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      console.log('用户已授权麦克风', stream)

      audioContext = new (window.AudioContext || window.webkitAudioContext)()

      source = audioContext.createMediaStreamSource(stream)

      recorder = audioContext.createScriptProcessor(4096, 1, 1) // 创建一个 ScriptProcessorNode （缓冲区大小， 输入node的声道的数量， 输出node的声道的数量）

      socket = new WebSocket(socketUrl)

      recorder.onaudioprocess = (audioProcessingEvent) => {
        // 输入缓存区
        var inputBuffer = audioProcessingEvent.inputBuffer

        var inputData = new Float32Array(inputBuffer.getChannelData(0))

        const compressedData = compress(inputData)

        const pcm = encodePCM(compressedData)

        const alaw = alawmulaw.alaw.encode(new Int16Array(pcm.buffer))

        console.log('pcm', pcm)
        console.log('alaw', pcm)
      }
    })
    .catch(err => {
      return new Error(err)
    })
  }
  /**
   * compress
   * 压缩为指定的输出频率 8000
   * 
   * @param {float32array} bytes         pcm二进制数据
   * @param {number} inputSampleRate     输入采样频率
   * @param {number} outputSampleRate    输出采样频率
   */
  const compress = function(bytes, inputSampleRate = 48000, outputSampleRate = 8000) {
    let rate = inputSampleRate / outputSampleRate, // 每rate位取一位
        compression = Math.max(rate, 1),
        length = Math.floor(( bytes.length ) / rate),
        result = new Float32Array(length),
        index = 0,
        j = 0;
    while(index < length) {
      result[index] = bytes[j]
      index++
      j += compression
    }
    return result
  }

  /**
   * encodePCM
   * 转换到我们需要的对应格式的编码
   *
   * @param {float32array} bytes      pcm二进制数据
   * @param {number}  sampleBits      采样位数
   * @param {boolean} littleEdian     是否是小端字节序
   * @returns {dataview}              pcm二进制数据
   */
  const encodePCM = function (bytes) {
    // 此处后三个参数固定，方便查看
    let sampleBits = 16,
        littleEdian = true,
        offset = 0,
        dataLength = bytes.length * (sampleBits / 8),
        buffer = new ArrayBuffer(dataLength),
        data = new DataView(buffer);

    for (var i = 0; i < bytes.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, bytes[i]));
      // 16位直接乘就行了
      data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, littleEdian);
    }

    return data

  }


  initUserMedia()
  getPermission()

  this.start = function () {
    console.log('开始讲话')
    try {
      source.connect(recorder)
      recorder.connect(audioContext.destination)
      return Promise.resolve({success: true})
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }

  this.stop = function () {
    console.log('结束讲话')
    try {
      source.disconnect(recorder)
      recorder.disconnect(audioContext.destination)
      return Promise.resolve({success: true})
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }
}

modules.export = {
  Talker
};