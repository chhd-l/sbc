import * as QRcode from 'qrcode';

export default class QRScan {
  div_id: string;
  div_can: HTMLElement;
  videos: Array<string>;
  medioConfig: any;
  can_open: boolean;
  mediaStream: MediaStream;

  constructor(div_id: string) {
    this.div_id = div_id;
    this.div_can = null;
    this.videos = [];
    this.medioConfig = {};
    this.can_open = false;
    this.init();
  }

  init() {
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    let promisifiedOldGUM = function (constraints) {
      let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
    }

    let self = this;
    self.div_can = document.getElementById(self.div_id);
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      devices.forEach(function (dv) {
        let kind = dv.kind;
        if (kind.match(/^video.*/)) {
          self.videos.push(dv.deviceId);
          //console.log(dv);
        }
      });
      let len = self.videos.length;
      self.can_open = true;
      self.medioConfig = {
        audio: false,
        video: { deviceId: self.videos[len - 1] }
      };
    });
  }

  openScan() {
    let self = this;
    if (self.can_open) {
      let vd = document.createElement('video');
      vd.setAttribute('id', 'video_id');
      navigator.mediaDevices
        .getUserMedia(self.medioConfig)
        .then(function (stream) {
          // vd.src = win.URL.createObjectURL(stream);
          vd.srcObject = stream; // 在新的浏览器中需使用此代替createObjectURL
          this.mediaStream = stream;
          self.div_can.appendChild(vd);
        })
        .catch(function (err) {
          let p = document.createElement('p');
          p.innerHTML = 'Your navigator does not support camera, you can open camera app to scan';
          self.div_can.appendChild(p);
        });
      vd.play();
    }
  }

  closeScan() {
    if (this.mediaStream) {
      this.mediaStream.stop();
    }
    this.div_can.innerHTML = '';
  }

  getImgDecode(func: Function) {
    let self = this;
    let video = document.getElementById('video_id') as HTMLVideoElement;
    let canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = 340;
    canvas.height = 305;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 340, 305);
    func(canvas.toDataURL('image/png'));

    // if (canvas.toBlob === undefined) {
    //     var base64 = canvas.toDataURL();
    //     var blob = self.Base64ToBlob(base64);
    //     self.sendBlob(blob, func);
    // } else {
    //     canvas.toBlob(function (blob) {
    //         self.sendBlob(blob, func);
    //     });
    // }
  }

  sendBlob(blob, func) {
    let fd = new FormData();
    fd.append('auth', 'lkl123456');
    fd.append('file', blob);
    let xhr = new XMLHttpRequest();
    xhr.open('post', 'http://123.206.7.80:10082/api/parse', true);
    xhr.onload = function () {
      if (func) {
        func(JSON.parse(xhr.responseText));
      }
    };
    xhr.send(fd);
  }

  Base64ToBlob(base64) {
    let code = window.atob(base64.split(',')[1]);
    let len = code.length;
    let as = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      as[i] = code.charCodeAt(i);
    }
    return new Blob([as], { type: 'image/png' });
  }
}
